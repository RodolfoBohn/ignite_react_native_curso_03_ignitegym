import { tokenGet } from "@storage/authToken/tokenGet";
import { tokenSave } from "@storage/authToken/tokenSave";
import { AppError } from "@utils/AppError";
import axios, {AxiosError, AxiosInstance} from "axios";

type SignOut = () => void

type QueueRequestType = {
  onSuccess: (token:string) => void
  onFailure: (error:AxiosError) => void
}

let requestQueue: QueueRequestType[] = []
let isRefreshing = false

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

const api = axios.create({
  baseURL: 'http://192.168.2.104:3333',
  timeout: 10000
}) as APIInstanceProps

api.registerInterceptTokenManager = (signOut) => {
  //Valida se é erro de usuário não autorizado
 const interceptTokenManager = api.interceptors.response.use(response => response, async (error) => {
  if(error.response?.status === 401) {
    if(error.response.data.message === 'token.expired' || error.response.data.message === 'token.invalid') {
      const {refreshToken} = await tokenGet()

      if(!refreshToken) {
        console.log("NAO TEM REFRESH TOKEN BONITAO")
        signOut()
        return Promise.reject(error)
      }

      //Cria uma fila para nao perder nenhuma requisição caso sejam feitas em sequência
      //e a primeira estiver revalidando o token
      const requestConfig = error.config
      if(isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            onSuccess: (token: string) => {
              requestConfig.headers = {'Authorization': `Bearer ${token}`}
              resolve(api(requestConfig))
            }, 
            onFailure: (error:AxiosError) => {
              reject(error)
            }
          })
        })
      }

      isRefreshing = true

      //carrega um novo token
      return new Promise(async (resolve, reject) => {
        try {
          const {data} = await api.post('sessions/refresh-token', {refresh_token: refreshToken})
          await tokenSave(data.token, data.refresh_token)
          

          if(requestConfig.data){
            requestConfig.data = JSON.parse(requestConfig.data)
          }

          requestConfig.headers = {"Authorization": `Bearer ${data.token}`}
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`

          requestQueue.forEach(request => {
            request.onSuccess(data.token)
          })

          resolve(api(requestConfig))
        } catch(error) {
          requestQueue.forEach(request => {
            request.onFailure(error as AxiosError)
            signOut()
            reject(error)
          })
        } finally {
          isRefreshing = false
          requestQueue = []
        }
      })
    }

    signOut()
  }


  //Verifica se é um erro tratado ou não
    if(error.response?.data?.message) {
      return Promise.reject(new AppError(error.response.data.message))
    }
  
    return Promise.reject(error)
  })

  return () => api.interceptors.response.eject(interceptTokenManager)
}

/*
// Interceptor básico, foi para dentro da outra funcao
api.interceptors.response.use(response => response, error => {

  console.log(error.response.status)
  if(error.response?.data?.message) {
    return Promise.reject(new AppError(error.response.data.message))
  }

  return Promise.reject(error)
})
*/

export {api}