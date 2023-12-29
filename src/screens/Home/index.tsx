import { useCallback, useEffect, useState } from "react";
import {  FlatList, HStack, Heading, Text, VStack } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { HomeHeader } from "@components/HomeHeader";
import { Group } from "@components/Group";
import { ExerciseCard } from "@components/ExerciseCard";
import { AppNavigationRoutesProps } from "@routes/app.routes";
import { api } from "@services/api";
import { useMessage } from "@hooks/useErrorMessage";
import { ExerciseDTO } from "src/dto/ExerciseDto";
import { Loading } from "@components/Loading";

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupActive, setGroupActive] = useState('costas')
  const {showError} = useMessage()

  const navigation = useNavigation<AppNavigationRoutesProps>()


  function handleSelectExercise(exerciseId: string) {
    navigation.navigate('exercise', {exerciseId})
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
      setGroupActive(response.data[0])
    } catch (error) {
      showError(error, "Não foi possível carregar os grupos musculares.")
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/bygroup/${groupActive}`)
      setExercises(response.data)
    } catch (error) {
      showError(error, "Não foi possível carregar os grupos musculares.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchExerciseByGroup()
  },[groupActive]))

  return (
    <VStack flex={1}>
      <HomeHeader/>

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Group 
          name={item}
          isActive={groupActive === item}
          onPress={() => setGroupActive(item)}
        />
        )}
        horizontal
        _contentContainerStyle={{
          px: 8
        }}          
        my={10}
        maxH={10}
        minH={10}
      />
      {
        isLoading ?
          <Loading />
        :
          <VStack p={8}>
            <HStack justifyContent="space-between" mb={5}>
              <Heading fontSize="md" fontFamily="heading" color="gray.200">
                Exercícios
              </Heading>
              <Text  fontSize="sm" color="gray.200">{exercises.length}</Text>
            </HStack>
            <FlatList
              data={exercises}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ExerciseCard
                  data={item}  
                  onPress={() => handleSelectExercise(item.id)}
                />
              )}
            />
          </VStack>
      }
    </VStack>
  )
}