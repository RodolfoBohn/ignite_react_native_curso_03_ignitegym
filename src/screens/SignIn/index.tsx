import {VStack, Image, Center, Text, Heading, ScrollView } from 'native-base'
import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuthContext } from '@contexts/AuthContext'
import { useState } from 'react'
import { useMessage } from '@hooks/useErrorMessage'

const schemaSignIn = yup.object({
  email: yup.string().required("Informe o e-mail").email("Informe um e-mail válido"), 
  password: yup.string().required("Informe a senha")
})

interface FormProps {
  email: string
  password: string
}
 
export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {signIn} = useAuthContext()
  const {showError} = useMessage()

  const {handleSubmit, control, formState: {errors}} = useForm<FormProps>({
    resolver: yupResolver(schemaSignIn)
  })

  async function onSubmit(data: FormProps) {
    try {
      setIsLoading(true)
      await signIn(data.email, data.password)
    } catch(error) {      
      setIsLoading(false)
      showError(error, "Não foi possível acessar a conta. Tente novamente mais tarde")
    }
  }

  function handleGoToSighUp() {
    navigation.navigate('signUp')
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
            Acesse sua conta
          </Heading>

          <Controller
            name='email'
            control={control}
            render={({field: {value, onChange}}) => (
              <Input 
              errorMessage={errors.email?.message}
                placeholder='E-mail' 
                keyboardType='email-address'
                autoCapitalize='none'
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({field: {value, onChange}}) => (
              <Input 
                errorMessage={errors.password?.message}
                placeholder='Senha' 
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onEndEditing={handleSubmit(onSubmit)}
                returnKeyType='send'
              />
            )}
          />


          
          <Button 
            title='Acessar' 
            onPress={handleSubmit(onSubmit)}
            isLoading={isLoading}
          />

            <Center w='full' mt={32} mb={2}>
              <Text color="gray.100" fontSize="sm" fontFamily="body" mb={2}>Ainda não tem acesso?</Text>
              <Button 
                title='Criar conta' 
                variant='outline' 
                onPress={handleGoToSighUp}
              />
          </Center>
        </Center>
      </VStack>
    </ScrollView>
  )
}