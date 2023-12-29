import { Center, Heading } from "native-base"

interface Props {
  title: string
}

export function ScreenHeader({title}:Props) {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading fontSize="xl" color="gray.100" fontFamily="heading">
        {title}
      </Heading>
    </Center>
  )
}