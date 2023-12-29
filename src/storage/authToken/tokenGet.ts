import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_STORAGE } from "../storageConfig";

type StorageAuthTokenProps = {
  token: string
  refreshToken: string
}

export async function tokenGet() {
  try {
    const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE)
    const tokens: StorageAuthTokenProps = response ? JSON.parse(response) : {}
    return tokens
  } catch (error) {
    throw error
  }
}