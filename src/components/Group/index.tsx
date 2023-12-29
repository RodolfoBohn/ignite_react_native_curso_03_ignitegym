import { Text, Pressable, IPressableProps } from "native-base";

interface Props extends IPressableProps {
  name: string
  isActive: boolean
}


export function Group({name, isActive, ...rest}: Props) {
  return (
    <Pressable
      w={24}
      h={10}
      mr={3}
      bg="gray.600"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderWidth: 1,
        borderColor: "green.500"
      }}
      {...rest}
    >
      <Text   
        color={isActive ? "green.500" :"gray.200"}
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
      >
        {name}
      </Text>
    </Pressable>
  )
}