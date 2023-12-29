import { api } from "@services/api";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { UserDTO } from "src/dto/UserDto";

import { userSave } from "@storage/user/userSave";
import {userGet} from "@storage/user/userGet"
import {userDelete} from "@storage/user/userDelete"
import { tokenSave } from "@storage/authToken/tokenSave";
import { tokenGet } from "@storage/authToken/tokenGet";
import { tokenDelete } from "@storage/authToken/tokenDelete";


interface AuthContextDataProps {
  user: UserDTO
  isLoadingUserFromStorage: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserData: (newUser: UserDTO) => Promise<void>
}

interface AuthContextProviderProps {
  children: ReactNode
}

const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({children}: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserFromStorage, setIsLoadingUserFromStorage] = useState(false)

  async function updateUserData(newUser: UserDTO) {
    try {
      setUser(newUser)
      await userSave(newUser)
    } catch(error) {
      throw error
    }
  }


  async function signIn(email: string, password: string) {
    try {
      setIsLoadingUserFromStorage(true)
      const {data} = await api.post('/sessions', {email, password})

      if(data.user && data.token && data.refresh_token) {
        setUser(data.user)
        await userSave(data.user)
        await tokenSave(data.token, data.refresh_token)

        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      }
    } catch(error) {
      throw error
    } finally {
      setIsLoadingUserFromStorage(false)
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserFromStorage(true)
      await userDelete()
      await tokenDelete()
      setUser({} as UserDTO)

    } catch(error) {
      throw error
    } finally {
      setIsLoadingUserFromStorage(false)
    }
  }

  async function init() {
    try {
      setIsLoadingUserFromStorage(true)
      const userSaved = await userGet()
      const tokenSaved = await tokenGet()

      if(userSaved.id && tokenSaved) {
        setUser(userSaved)
        api.defaults.headers.common['Authorization'] = `Bearer ${tokenSaved.token}`
      }
    } catch(error) {
      console.log(error)
    } finally{
      setIsLoadingUserFromStorage(false)
    }
  }

  useEffect(() => {
    init()
  },[])

  useEffect(() => {
    const register = api.registerInterceptTokenManager(signOut)

    return () => register()
  },[])

  return (
    <AuthContext.Provider value={{
        user, 
        isLoadingUserFromStorage,
        signIn, 
        signOut, 
        updateUserData
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  return useContext(AuthContext)
}