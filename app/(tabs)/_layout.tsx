import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="firstpage" options={{ headerShown: false }} />
      <Stack.Screen name="dataEntry" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
