import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme} from 'native-base'

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";
import { useAuthContext } from "@contexts/AuthContext";
import { Loading } from "@components/Loading";

export function Routes() {
  const {colors} = useTheme()
  const {user, isLoadingUserFromStorage} = useAuthContext()


  const theme = DefaultTheme

  theme.colors.background = colors.gray[700]
  if (isLoadingUserFromStorage) {
    return <Loading />
  }

  return (
    <Box flex={1} bg='gray.700'>
    <NavigationContainer theme={theme}>
      {user.id ? <AppRoutes /> :<AuthRoutes />}
    </NavigationContainer>
    </Box>
  )
}