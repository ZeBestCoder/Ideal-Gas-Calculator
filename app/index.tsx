import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { router } from "expo-router";

const index = () => {
  return (
    <SafeAreaView className="flex h-full bg-[#1E1E1E] items-center justify-between">
      <View className="flex-1 w-full justify-center items-center">
        <Text className="text-[#fff] font-Fredoka-Regular text-[32px] text-center w-[90%]">
          PhysCalculator is a mobile app that allows you to calculate a
          thermodynamic value using two parameters.
        </Text>
      </View>
      <TouchableOpacity
        className="bg-[#1E63A7] rounded-[15px] p-3 mb-4 mr-4"
        style={{ alignSelf: "flex-end" }}
        onPress={() => {
          router.push("/(tabs)/firstpage");
        }}
      >
        <Text className="text-[32px] text-[#fff]">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default index;
