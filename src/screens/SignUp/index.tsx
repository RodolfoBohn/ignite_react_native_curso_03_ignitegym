import {VStack, Image, Center, Text, Heading, ScrollView } from 'native-base'
import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

import {api} from '@services/api'
import { useState } from 'react'
import { useAuthContext } from '@contexts/AuthContext'
import { useMessage } from '@hooks/useErrorMessage'

const signUpSchema = yup.object({
  name: yup.string().required("Informe o nome"), 
  email: yup.string().required("Informe o e-mail").email("Informe um e-mail válido"), 
  password: yup.string().required("Informe a senha"), 
  passwordConfirm: yup.string().required("Informe a confirmação de senha").oneOf([yup.ref("password"), ""], "A confirmação da senha não confere.")
})


interface FormDataProps {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false)

  const {signIn} = useAuthContext()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {showError} = useMessage()

  function handleGoToSighIn() {
    navigation.navigate('signIn')
  }

  const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  async function handleSignUp({name, email, password}:FormDataProps) {
    try {
      setIsLoading(true)
      const response = await api.post('/users', {name, email, password})
      await signIn(email, password)
      /*
      const response = await fetch('http://192.168.2.104:3333/users', {
        headers: {
          'Acept': 'application/json', 
          'Content-type': 'application/json'
        }, 
        method: 'POST', 
        body: JSON.stringify({name, email, password})
      })
  
      const data = await response.json()
      console.log(data)
      */
    } catch(error) {
      setIsLoading(false)
      showError(error, "Não foi possível criar a conta. Tente novamente mais tarde")
    }
  }


  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      style={{width: '100%'}}
      contentContainerStyle={{flexGrow: 1}}
    >
      <VStack flex={1} width="full">
        <Image 
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt=""
          position='absolute'
          resizeMode='contain'
        />
        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm" fontFamily="body">Treine sua mente e o seu corpo</Text>
        </Center>
        <Center px={10}>
          <Heading color="gray.100" fontFamily='heading' fontSize="xl" mb={6}>
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name='name'
            render={ ({field}) => (
            <Input 
              placeholder='Nome'
              onChangeText={field.onChange}
              value={field.value}
              errorMessage={errors.name?.message}
            />)}
          />
          
          <Controller
            control={control}
            name='email'
            render={ ({field}) => (
            <Input 
              placeholder='E-mail' 
              keyboardType='email-address'
              autoCapitalize='none'
              onChangeText={field.onChange}
              value={field.value}
              errorMessage={errors.email?.message}
            />)}
          />

          <Controller
            control={control}
            name='password'
            render={ ({field}) => (
            <Input 
              placeholder='Senha' 
              secureTextEntry
              onChangeText={field.onChange}
              value={field.value}
              errorMessage={errors.password?.message}
            />)}
          />

          <Controller
            control={control}
            name='passwordConfirm'
            render={ ({field}) => (
            <Input 
            placeholder='Confirme a senha' 
              secureTextEntry
              onChangeText={field.onChange}
              value={field.value}
              onSubmitEditing={handleSubmit(handleSignUp)}
              returnKeyType='send'
              errorMessage={errors.passwordConfirm?.message}
            />)}
          />

          <Button 
            title='Criar e acessar' 
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
            />

            <Center w='full' mt={24} mb={2}>
              <Button 
                title='Voltar para o login'
                variant='outline' 
                onPress={handleGoToSighIn}
              />
          </Center>
        </Center>
      </VStack>
    </ScrollView>
  )
}