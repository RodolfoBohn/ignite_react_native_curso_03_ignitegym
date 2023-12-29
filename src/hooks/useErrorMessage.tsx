import { AppError } from "@utils/AppError";
import { useToast } from "native-base";

export function useMessage() {
  const toast = useToast()

  function showError(error?: any, defaultMessage = "Não foi possível executar a ação. Por favor tente novamente") {
    const isAppError = error ? error instanceof AppError : false
    const errorTitle = isAppError ? error.message : defaultMessage
     return toast.show({
      title: errorTitle , 
      placement: 'top',
      bg: 'red.500', 
      p: 1,
      mx: 3,
      fontFamily: 'body', 
      fontSize: 'md', 
      textAlign: 'center',
      alignItems: 'center', 
      justifyContent:'center'
    })
  }

  function showSuccess(message: string) {
     return toast.show({
      title: message , 
      placement: 'top',
      bg: 'green.500', 
      p: 1,
      mx: 3,
      fontFamily: 'body', 
      fontSize: 'md', 
      textAlign: 'center',
      alignItems: 'center', 
      justifyContent:'center'
    })
  }

  return {
    showError, 
    showSuccess
  }
}