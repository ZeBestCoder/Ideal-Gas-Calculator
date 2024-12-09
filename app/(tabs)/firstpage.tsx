import { Image, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex h-full bg-[#1E1E1E] items-center justify-between">
      <View className="flex-1 w-full justify-center items-center">
        <Text className="text-[#fff] text-[32px] text-center w-[90%]">
          The calculations are specific to ideal gas
        </Text>
        <Text className="text-[#fff] text-[32px] text-center w-[90%]">
          pV=nRT
        </Text>
      </View>
      <TouchableOpacity
        className="bg-[#1E63A7] rounded-[15px] p-2 mb-4 mr-4"
        style={{ alignSelf: "flex-end" }}
        onPress={() => {
          router.push("/(tabs)/dataEntry");
        }}
      >
        <Text className="text-[32px] text-[#fff]">Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
