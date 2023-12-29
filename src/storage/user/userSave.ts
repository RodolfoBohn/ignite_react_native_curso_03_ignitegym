import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDTO } from "src/dto/UserDto";
import { USER_STORAGE } from "../storageConfig";

export async function userSave(user:UserDTO) {
  try {
    await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user))
  } catch (error) {
    throw error
  }
}