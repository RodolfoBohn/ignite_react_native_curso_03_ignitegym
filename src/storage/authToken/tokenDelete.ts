import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "../storageConfig";

export async function tokenDelete() {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE)
  } catch (error) {
    throw error
  }
}