import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { HStack, Heading, Icon, Image, Text, VStack } from "native-base";
import {Entypo} from "@expo/vector-icons"
import { ExerciseDTO } from "src/dto/ExerciseDto";
import { api } from "@services/api";

interface Props extends TouchableOpacityProps{
  data: ExerciseDTO
}

export function ExerciseCard({data, ...rest}: Props) {
  return (
    <TouchableOpacity {...rest}>
      <HStack 
        backgroundColor="gray.500"
        alignItems="center" 
        p={2} 
        pr={4} 
        mb={3}
      >        
        <Image 
        source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}} 
        w={16}
        h={16}
        rounded="md"
        alt="Exercise image"
        mr={4}
        resizeMode="center"
        />

        <VStack flex={1}>
          <Heading fontSize='lg' color="white" fontFamily="heading">
            {data.name}
          </Heading>
          <Text fontSize="md" color="gray.200">
          {`${data.series} séries x ${data.repetitions} repetições`}
          </Text>
        </VStack>
        <Icon
          as={Entypo}
          name="chevron-thin-right"
          color="gray.200"
        />
      </HStack>
    </TouchableOpacity>
  )
}