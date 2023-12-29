import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Center, ScrollView, Skeleton, VStack, Text, Heading } from "native-base";
import { useAuthContext } from "@contexts/AuthContext";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useMessage } from "@hooks/useErrorMessage";

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { api } from "@services/api";
import { UserDTO } from "src/dto/UserDto";

import defaultUserPhoto from '@assets/userPhotoDefault.png'

import mime from 'mime'

interface ProfileFormDataProps {
  name: string
  email: string
  passwordOld?: string
  passwordNew?: string | null
  passwordNewConfirm?: string | null
}

const profileFormSchema = yup.object({
  name: yup
          .string()
          .required("Informe o nome"),
  email: yup
          .string()
          .required(),
  passwordOld: yup
                .string(), 
  passwordNew: yup
                .string()
                .min(6, "A senha deve conter no mínimo 6 dígitos")
                .nullable()
                .transform(value => !!value ? value : null),
  passwordNewConfirm: yup
                      .string()
                      .nullable()
                      .transform(value => !!value ? value : null)
                      .oneOf([yup.ref("passwordNew"), ""], "A confirmação da senha não confere.")
                      .when('passwordNew', {
                        is: (Field: any) => Field,
                        then: (schema) => yup
                        .string()
                        .nullable()
                        .required("Informe a confirmação da senha")
                        .transform(value => !!value ? value : null)
                        .oneOf([yup.ref("passwordNew"), ""], "A confirmação da senha não confere.")
                      })
})

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const {user, updateUserData} = useAuthContext()
  const {showError, showSuccess} = useMessage()

  const {control, handleSubmit} = useForm<ProfileFormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileFormSchema)
  })

  async function onSubmit(data: ProfileFormDataProps) {
    try {
      setIsUpdating(true)
      const newUser: UserDTO = {
        ...user, 
        name: data.name
      }
      await api.put('/users', {name: data.name, password: data.passwordNew, old_password: data.passwordOld })
      await updateUserData(newUser)
      showSuccess("Dados do usuário atualizados com sucesso! ")
    } catch(error) {
      showError(error, "Não foi possível atualizar os dados do usuário.")
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleEditPhoto() {
    try {
      setPhotoIsLoading(true)
      const selectedPhoto = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        quality: 1, 
        aspect: [4,4],
      })
  
      if(selectedPhoto.canceled || !selectedPhoto.assets[0].uri) {
        return
      }

      const photoData = await FileSystem.getInfoAsync(selectedPhoto.assets[0].uri) as FileSystem.FileInfo
      if (photoData.size && photoData.size / 1024 / 1024 > 5 ) {
        showError(undefined,"Essa imagem é muito grande. Escolha uma de até 5MB.")
      }

      const fileExtention = selectedPhoto.assets[0].uri.split(".").pop()
      const newImageUri =  "file:///" + selectedPhoto.assets[0].uri.split("file:/").join("")

      const fileData = {
        name: `${user.name}.${fileExtention}`.toLowerCase(),
        uri: newImageUri,
        type: mime.getType(selectedPhoto.assets[0].uri)
      } as any

      const userPhotoUploadForm = new FormData()
      userPhotoUploadForm.append('avatar', fileData)

      const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }, 
      })

      const userUpdated: UserDTO = {
        ...user, 
        avatar: avatarUpdatedResponse.data.avatar
      }
      
      updateUserData(userUpdated)
      showSuccess("Foto atualizada com sucesso!")
    } catch(error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
    
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView>
      <Center mt={6} px={8}>
        {
        photoIsLoading ?
          <Skeleton 
            w={33}
            h={33}
            rounded="full"
            startColor="gray.500"
            endColor="gray.400"
          />
        :
          <UserPhoto 
            size={33}
            source={user.avatar ?{
              uri:`${api.defaults.baseURL}/avatar/${user.avatar}` 
            } : defaultUserPhoto}
            alt="User photo"
          />
      }

      <TouchableOpacity 
        onPress={handleEditPhoto}
      >
        <Text mt={2} mb={8} fontSize="md" fontWeight="bold" color="green.500">
          Alterar foto
        </Text>
      </TouchableOpacity>

      <Controller 
        control={control}
        name="name"
        render={({field: {value, onChange}, formState: {errors}}) => (
          <Input
            placeholder="Nome"
            onChangeText={onChange}
            value={value}
            errorMessage={errors.name?.message}
          />
        )}
      />

      <Controller 
        control={control}
        name="email"
        render={({field: {value, onChange}, formState: {errors}}) => (
          <Input
            placeholder="E-mail"
            isDisabled
            onChangeText={onChange}
            value={value}
            errorMessage={errors.email?.message}
          />
        )}
      />

      <VStack w="full" mt={12} mb={9}>
        <Heading color="gray.200" fontFamily="heading" fontSize="md" mb={2}>
          Alterar senha
        </Heading>
        
        <Controller 
          control={control}
          name="passwordOld"
          render={({field: {value, onChange},formState: {errors}}) => (
            <Input 
            placeholder="Senha antiga"
            secureTextEntry
            onChangeText={onChange}
            value={value}
            errorMessage={errors.passwordOld?.message}
          />
          )}
        />

        <Controller 
          control={control}
          name="passwordNew"
          render={({field: {value, onChange}, formState: {errors}}) => (
            <Input 
            placeholder="Nova senha"
            secureTextEntry
            onChangeText={onChange}
            value={value ?? undefined}
            errorMessage={errors.passwordNew?.message}
          />
          )}
        />

        <Controller 
          control={control}
          name="passwordNewConfirm"
          render={({field: {value, onChange}, formState: {errors}}) => (
            <Input 
            placeholder="Confirme a nova senha"
            secureTextEntry
            onChangeText={onChange}
            value={value ?? undefined}
            errorMessage={errors.passwordNewConfirm?.message}
          />
          )}
        />

        <Button 
          title="Atualizar"
          mt={4}
          onPress={handleSubmit(onSubmit)}
          isLoading={isUpdating}
        />
      </VStack>

      </Center>
      </ScrollView>
    </VStack>
  )
}