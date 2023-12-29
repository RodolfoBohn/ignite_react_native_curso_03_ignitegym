import {Button as BaseButton, Text, IButtonProps} from 'native-base'


interface Props extends IButtonProps {
  title: string
  variant?: 'solid' | 'outline'
}

export function Button({title, variant = 'solid', ...rest}:Props) {
  return (
    <BaseButton
      bg={variant === 'outline' ? "transparent" : "green.700"}
      rounded="sm"
      w="full"
      h={14}
      _pressed={{
        bg: variant === 'outline' ? 'gray.500' : 'green.500'
      }}
      borderColor='green.500'
      borderWidth={variant === 'outline' ? 1 : 0}
      {...rest}
    >
      <Text 
        color={variant === 'outline' ? "green.500" : "white"}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </BaseButton>
  )
}