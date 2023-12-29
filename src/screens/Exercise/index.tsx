import { TouchableOpacity } from "react-native";
import {  Box, HStack, Heading, Icon, Image, Text, VStack, ScrollView } from "native-base";
import {Feather} from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigationRoutesProps } from "@routes/app.routes";
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";
import { useMessage } from "@hooks/useErrorMessage";
import { api } from "@services/api";
import { useEffect, useState } from "react";
import { ExerciseDTO } from "src/dto/ExerciseDto";
import { Loading } from "@components/Loading";

interface ExerciseRouteProps {
  exerciseId: string
}


export function Exercise() {
  const [sendingExercise, setSendingExercise] = useState(false)
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const navigation = useNavigation<AppNavigationRoutesProps>()
  const route = useRoute()
  const {showError, showSuccess} = useMessage()

  const {exerciseId} = route.params as ExerciseRouteProps

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
    } catch (error) {
      showError(error, "Não foi possível carregar os detalhes do exercício.")
  } finally {
    setIsLoading(false)
  }
}

  async function handleSendExerciseToHistory() {
    try {
      setSendingExercise(true)
      await api.post(`/history`, {exercise_id: exerciseId})
      showSuccess("Parabéns! Exercício incluído ao seu histórico")
      navigation.navigate('history')
    } catch (error) {
      showError(error, "Não foi possível registrar o exercício no histórico.")
  } finally {
    setSendingExercise(false)
  }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  useEffect(() => {
    fetchExerciseDetails()
  },[exerciseId])

  return (
    <VStack flex={1}>
      { isLoading ? 
          <Loading />
        :
          <>
            <VStack px={8} pt={12} bg={"gray.600"}>
              <TouchableOpacity onPress={handleGoBack}>
                <Icon 
                  as={Feather} 
                  name="arrow-left" 
                  color="green.500" 
                  size={6} 
                />
              </TouchableOpacity>
              <HStack justifyContent="space-between" mt={4} mb={8} alignItems="center">
                <Heading color="gray.100" fontSize="lg" fontFamily="heading" flexShrink={1}>
                  {exercise.name}
                </Heading>

                <HStack alignItems="center">
                  <BodySvg />
                  <Text color="gray.200" ml={1} textTransform="capitalize">
                    {exercise.group}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
            <ScrollView>
              <VStack p={8}>
                <Box mb={3} rounded="lg" overflow="hidden">
                  <Image 
                    source={{
                      uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
                    }}
                    w="full"
                    h={80}
                    alt="Imagem do exercício"
                    resizeMode="cover"
                  />
                </Box>

                <Box bg="gray.600" rounded="md" pb={4} px={4}>
                  <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                    <HStack>
                      <SeriesSvg />
                      <Text color="gray.200" ml={2}>
                        {`${exercise.series} séries`}
                      </Text>
                    </HStack>

                    <HStack>
                      <RepetitionSvg />
                      <Text color="gray.200" ml={2}>
                      {`${exercise.repetitions} repetições`}
                      </Text>
                    </HStack>
                  </HStack>
                  <Button 
                    title="Marcar como realizado"
                    isLoading={sendingExercise}
                    onPress={handleSendExerciseToHistory}
                  />
                </Box>
              </VStack>
            </ScrollView>
          </>
      } 
    </VStack>
  )
}