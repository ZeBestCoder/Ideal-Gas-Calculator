import React, { useState, useEffect } from "react";
// Importing necessary React Native components
import {
  View,
  Text,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // For dropdown menus
import { LineChart } from "react-native-chart-kit"; // For graph visualization

const IdealGasCalculator = () => {
  // State variables for input and output values
  const [pressure, setPressure] = useState("");
  const [volume, setVolume] = useState("");
  const [temperature, setTemperature] = useState("");
  const [moles, setMoles] = useState("1");
  const [selectedVariable, setSelectedVariable] = useState("pressure");
  const [graphData, setGraphData] = useState([]);
  const [result, setResult] = useState("");

  // State variables for unit selection
  const [pressureUnit, setPressureUnit] = useState("atm");
  const [volumeUnit, setVolumeUnit] = useState("L");
  const [temperatureUnit, setTemperatureUnit] = useState("K");

  // Ideal gas constant (L·atm)/(mol·K)
  const R = 0.08206;

  // Function to convert pressure between units
  const convertPressure = (value, fromUnit, toUnit) => {
    const conversions = {
      atm: { kPa: 101.325, mmHg: 760, psi: 14.6959 },
      kPa: { atm: 1 / 101.325, mmHg: 7.50062, psi: 0.145038 },
      mmHg: { atm: 1 / 760, kPa: 1 / 7.50062, psi: 0.0193368 },
      psi: { atm: 1 / 14.6959, kPa: 1 / 0.145038, mmHg: 1 / 0.0193368 },
    };
    if (fromUnit === toUnit) return value; // No conversion needed
    return value * conversions[fromUnit][toUnit];
  };

  // Function to convert volume between units
  const convertVolume = (value, fromUnit, toUnit) => {
    const conversions = {
      L: { mL: 1000, m3: 0.001, cm3: 1000 },
      mL: { L: 0.001, m3: 1e-6, cm3: 1 },
      m3: { L: 1000, mL: 1e6, cm3: 1e6 },
      cm3: { L: 0.001, mL: 1, m3: 1e-6 },
    };
    if (fromUnit === toUnit) return value; // No conversion needed
    return value * conversions[fromUnit][toUnit];
  };

  // Function to convert temperature between units
  const convertTemperature = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value; // No conversion needed
    if (fromUnit === "K") {
      if (toUnit === "C") return value - 273.15;
      if (toUnit === "F") return ((value - 273.15) * 9) / 5 + 32;
    } else if (fromUnit === "C") {
      if (toUnit === "K") return value + 273.15;
      if (toUnit === "F") return (value * 9) / 5 + 32;
    } else if (fromUnit === "F") {
      if (toUnit === "K") return ((value - 32) * 5) / 9 + 273.15;
      if (toUnit === "C") return ((value - 32) * 5) / 9;
    }
    return value;
  };

  // Function to calculate the missing variable based on user input
  const calculateMissingVariable = () => {
    Keyboard.dismiss();

    // Parse user inputs and convert to standard units
    const n = parseFloat(moles) || 1; // Default moles to 1 if not specified
    const p =
      pressureUnit === "atm"
        ? parseFloat(pressure) || 0
        : convertPressure(parseFloat(pressure) || 0, pressureUnit, "atm");
    const v =
      volumeUnit === "L"
        ? parseFloat(volume) || 0
        : convertVolume(parseFloat(volume) || 0, volumeUnit, "L");
    const t =
      temperatureUnit === "K"
        ? parseFloat(temperature) || 0
        : convertTemperature(
            parseFloat(temperature) || 0,
            temperatureUnit,
            "K"
          );

    // Calculate the selected missing variable using the ideal gas law
    if (selectedVariable === "pressure" && v && t) {
      const resultInAtm = (n * R * t) / v;
      const convertedPressure = convertPressure(
        resultInAtm,
        "atm",
        pressureUnit
      );
      if (!isNaN(convertedPressure)) {
        setPressure(convertedPressure.toFixed(2)); // Update pressure state
        setResult(
          `Calculated Pressure: ${convertedPressure.toFixed(2)} ${pressureUnit}`
        ); // Display result
      }
    } else if (selectedVariable === "volume" && p && t) {
      const resultInL = (n * R * t) / p;
      const convertedVolume = convertVolume(resultInL, "L", volumeUnit);
      if (!isNaN(convertedVolume)) {
        setVolume(convertedVolume.toFixed(2)); // Update volume state
        setResult(
          `Calculated Volume: ${convertedVolume.toFixed(2)} ${volumeUnit}`
        ); // Display result
      }
    } else if (selectedVariable === "temperature" && p && v) {
      const resultInK = (p * v) / (n * R);
      const convertedTemperature = convertTemperature(
        resultInK,
        "K",
        temperatureUnit
      );
      if (!isNaN(convertedTemperature)) {
        setTemperature(convertedTemperature.toFixed(2)); // Update temperature state
        setResult(
          `Calculated Temperature: ${convertedTemperature.toFixed(
            2
          )} ${temperatureUnit}`
        ); // Display result
      }
    }
  };

  // Function to generate data points for the graph based on user input
  const generateGraphData = () => {
    const dataPoints = [];
    const n = parseFloat(moles); // Number of moles

    if (selectedVariable === "pressure") {
      const p =
        pressureUnit === "atm"
          ? parseFloat(pressure) || 1
          : convertPressure(parseFloat(pressure) || 1, pressureUnit, "atm");
      for (let t = 200; t <= 400; t += 20) {
        const v = (n * R * t) / p; // Generate volume data points
        dataPoints.push({ x: t, y: v });
      }
    }
    setGraphData(dataPoints); // Update graph data state
  };

  useEffect(() => {
    generateGraphData();
  }, [
    pressure,
    volume,
    temperature,
    selectedVariable,
    pressureUnit,
    volumeUnit,
    temperatureUnit,
  ]);

  return (
    <ScrollView className="flex h-full p-4 bg-[#1E1E1E] pt-8 ">
      <View className="flex items-center justify-center">
        <Text className="text-2xl font-bold mb-5 text-[#fff]">
          Insert the value of two measurements and calculate the third
        </Text>
      </View>

      <View className="my-4">
        <Text className="text-lg font-semibold text-[#fff] mb-2">
          Variable to calculate:
        </Text>
        <Picker
          selectedValue={selectedVariable}
          onValueChange={(value) => setSelectedVariable(value)}
          style={{
            backgroundColor: "#1E1E1E",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          <Picker.Item label="Pressure" value="pressure" />
          <Picker.Item label="Volume" value="volume" />
          <Picker.Item label="Temperature" value="temperature" />
        </Picker>
      </View>

      {selectedVariable !== "pressure" && (
        <View className="my-4">
          <Text className="text-lg font-semibold text-[#fff]">Pressure:</Text>
          <TextInput
            value={pressure}
            onChangeText={setPressure}
            placeholder="Enter pressure"
            keyboardType="numeric"
            className="border border-[#fff] p-2 rounded-[15px] mb-2 text-[#fff]"
          />
          <Picker
            selectedValue={pressureUnit}
            onValueChange={(value) => setPressureUnit(value)}
            style={{
              backgroundColor: "#1E1E1E",
              color: "#fff",
              borderRadius: 8,
            }}
          >
            <Picker.Item label="atm" value="atm" />
            <Picker.Item label="kPa" value="kPa" />
            <Picker.Item label="mmHg" value="mmHg" />
            <Picker.Item label="psi" value="psi" />
          </Picker>
        </View>
      )}

      {selectedVariable !== "volume" && (
        <View className="my-4">
          <Text className="text-lg font-semibold text-[#fff]">Volume:</Text>
          <TextInput
            value={volume}
            onChangeText={setVolume}
            placeholder="Enter volume"
            keyboardType="numeric"
            className="border border-[#fff] p-2 rounded-[15px] mb-2 text-[#fff]"
          />
          <Picker
            selectedValue={volumeUnit}
            onValueChange={(value) => setVolumeUnit(value)}
            style={{
              backgroundColor: "#1E1E1E",
              color: "#fff",
              borderRadius: 8,
            }}
          >
            <Picker.Item label="L" value="L" />
            <Picker.Item label="mL" value="mL" />
            <Picker.Item label="m³" value="m3" />
            <Picker.Item label="cm³" value="cm3" />
          </Picker>
        </View>
      )}

      {selectedVariable !== "temperature" && (
        <View className="my-4">
          <Text className="text-lg font-semibold text-[#fff]">
            Temperature:
          </Text>
          <TextInput
            value={temperature}
            onChangeText={setTemperature}
            placeholder="Enter temperature"
            keyboardType="numeric"
            className="border border-[#fff] p-2 rounded-[15px] mb-2 text-[#fff]"
          />
          <Picker
            selectedValue={temperatureUnit}
            onValueChange={(value) => setTemperatureUnit(value)}
            style={{
              backgroundColor: "#1E1E1E",
              color: "#fff",
              borderRadius: 8,
            }}
          >
            <Picker.Item label="K" value="K" />
            <Picker.Item label="°C" value="C" />
            <Picker.Item label="°F" value="F" />
          </Picker>
        </View>
      )}

      <TouchableOpacity
        onPress={calculateMissingVariable}
        className=" bg-[#1E63A7] rounded-[15px] p-3 items-center flex"
      >
        <Text className="text-[#fff] text-[24px]">Calculate</Text>
      </TouchableOpacity>

      {result ? (
        <Text className="text-xl font-bold text-[#fff] mt-4">{result}</Text>
      ) : null}

      {graphData.length > 0 && (
        <View className="mt-5">
          <Text className="text-lg font-bold text-[#fff] mb-2">
            Relationship Graph
          </Text>
          <LineChart
            data={{
              labels: graphData.map((_, index) => index.toString()),
              datasets: [{ data: graphData.map((point) => point.y) }],
            }}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      )}
      <View className="h-[60px]"></View>
    </ScrollView>
  );
};

export default IdealGasCalculator;
