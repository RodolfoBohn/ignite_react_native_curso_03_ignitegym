import {Input as BaseInput, FormControl, IInputProps} from 'native-base'
import { Form } from 'react-hook-form'

interface Props extends IInputProps {
  errorMessage?: string
}

export function Input({errorMessage, isInvalid, ...rest}: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <BaseInput 
        bg="gray.400"
        h={14}
        p={4}
        borderWidth={1}
        borderColor="gray.400"
        color="white"
        fontSize="md"
        fontFamily="body"
        placeholderTextColor="gray.300"    
        isInvalid={invalid}
        _invalid={{ 
          borderColor: "red.500"
        }}
        _focus={{
          bg: 'gray.700', 
          borderColor: 'green.500'
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}