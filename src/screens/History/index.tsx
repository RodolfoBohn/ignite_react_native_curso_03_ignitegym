import { useCallback, useState } from "react";
import { Heading, SectionList, Text, VStack } from "native-base";
import { ScreenHeader } from "@components/ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { useMessage } from "@hooks/useErrorMessage";
import { api } from "@services/api";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "@components/Loading";
import { HistoryByDayDTO } from "src/dto/HistoryByDayDTO";

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

const {showError} = useMessage()

async function fetchHistory() {
  try {
    setIsLoading(true)
    const response = await api.get(`/history`)
    setExercises(response.data)
  } catch (error) {
    showError(error, "Não foi possível carregar o histórico")
} finally {
  setIsLoading(false)
}
}

useFocusEffect(useCallback(() => {
  fetchHistory()
}, []))

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      {isLoading ?
        <Loading />  
      : 
        <SectionList
          sections={exercises}
          renderItem={({item}) => (
            <HistoryCard 
              data={item}
            />

          )}
          keyExtractor={item => item.id}
          renderSectionHeader={({section}) => (
            <Heading color="gray.200" fontSize="md" fontFamily="heading" mt={10} mb={3}>
              {section.title}
            </Heading>
          )}
          contentContainerStyle={exercises.length === 0 && {flex: 1, justifyContent: 'center'}}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Ainda não há exercícios registrados.
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          px={8}
        />
      }
    </VStack>
  )
}