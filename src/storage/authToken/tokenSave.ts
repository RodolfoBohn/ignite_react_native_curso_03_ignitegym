import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "../storageConfig";

export async function tokenSave(authToken: string, refreshToken: string) {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_STORAGE, JSON.stringify({authToken, refreshToken}))
  } catch (error) {
    throw error
  }
}