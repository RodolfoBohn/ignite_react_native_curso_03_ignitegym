import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "src/dto/UserDto";
import { USER_STORAGE } from "../storageConfig";

export async function userGet() {
  try {
    const response = await AsyncStorage.getItem(USER_STORAGE)
    const user: UserDTO = response ? JSON.parse(response) : {}
    return user
  } catch (error) {
    throw error
  }
}