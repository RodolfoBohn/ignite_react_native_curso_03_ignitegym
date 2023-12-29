import { TouchableOpacity } from "react-native";
import { HStack, Heading, Icon, Text, VStack } from "native-base";
import { MaterialIcons } from '@expo/vector-icons'

import { UserPhoto } from "@components/UserPhoto";
import { useAuthContext } from "@contexts/AuthContext";

import defaultUserPhoto from '@assets/userPhotoDefault.png'
import { api } from "@services/api";

export function HomeHeader() {
  const {user, signOut} = useAuthContext()

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems='center'>
      <UserPhoto
        size={16}
        source={ user.avatar ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : defaultUserPhoto}
        alt="Profile photo"
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity
        onPress={signOut}
      >
        <Icon 
          as={MaterialIcons}
          name="logout"
          size={7}
          color="gray.200"
        />
      </TouchableOpacity>
    </HStack>
  )
}