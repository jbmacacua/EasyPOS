import React, { useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ModalSelector from 'react-native-modal-selector'; // Import ModalSelector

export default function SalesCalculation() {
    const screenWidth = Dimensions.get("window").width;

    // State to handle selected day
    const [selectedDay, setSelectedDay] = useState("All Days");

    // Sales data for each day of the week
    const salesData = {
        Monday: [5000, 6000, 7000, 8000, 9000, 10000],
        Tuesday: [4000, 5000, 6000, 7000, 8500, 9500],
        Wednesday: [4500, 5500, 6500, 7500, 8800, 9800],
        Thursday: [5000, 6000, 7000, 8500, 9000, 10500],
        Friday: [6000, 7000, 8000, 9000, 9500, 11000],
        Saturday: [7000, 8000, 8500, 9500, 10500, 11500],
        Sunday: [8000, 9000, 10000, 11000, 12000, 13000],
    };

    // Update data based on selected day
    const getData = () => {
        if (selectedDay === "All Days") {
            return [5000, 8000, 6000, 7000, 10000, 9000]; // Default data (All Days)
        }
        return salesData[selectedDay]; // Filter data for the selected day
    };

    // Data for ModalSelector
    const dayOptions = [
        { label: "All Days", key: "All Days" },
        { label: "Monday", key: "Monday" },
        { label: "Tuesday", key: "Tuesday" },
        { label: "Wednesday", key: "Wednesday" },
        { label: "Thursday", key: "Thursday" },
        { label: "Friday", key: "Friday" },
        { label: "Saturday", key: "Saturday" },
        { label: "Sunday", key: "Sunday" },
    ];

    return (
        <View className="bg-white p-5 rounded-lg shadow-md">
            {/* Header with filter and title */}
            <View className="mb-4 flex-row justify-between">
                {/* Title */}
                <Text className="text-[15px] font-bold text-[#3C80B4] text-center">
                    Sales Calculation
                </Text>

                {/* Filter Dropdown */}
                <View className="mb-4">
                    <ModalSelector
                        data={dayOptions}
                        initValue={selectedDay}
                        onChange={(option) => setSelectedDay(option.key)}
                        style={{
                            width: 110,
                            backgroundColor: "#3C80B4",
                            borderRadius: 25, // Rounded corners
                            color: "white",
                        }}
                        optionTextStyle={{
                            color: "#3C80B4",
                            fontSize: 16,
                            paddingVertical: 10,
                        }}
                        cancelTextStyle={{
                            color: "red",
                            fontSize: 16,
                        }}
                        selectStyle={{
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#3C80B4",
                            borderRadius: 25,
                        }}
                        selectTextStyle={{
                            color: "white",
                            fontSize: 16,
                        }}
                    />
                </View>
            </View>

            {/* Line Chart */}
            <LineChart
                data={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    datasets: [
                        {
                            data: getData(), // Use data based on the selected day
                            strokeWidth: 2, // Thickness of the line
                        },
                    ],
                }}
                width={screenWidth - 40} // Graph width
                height={250} // Graph height
                yAxisLabel="$" // Prefix for the y-axis
                yAxisSuffix="k" // Suffix for the y-axis
                chartConfig={{
                    backgroundColor: "#3C80B4",
                    backgroundGradientFrom: "#3C80B4",
                    backgroundGradientTo: "#1C547E",
                    decimalPlaces: 0, // Round numbers to whole
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    propsForDots: {
                        r: "6", // Dot size
                        strokeWidth: "2",
                        stroke: "#ffffff",
                    },
                }}
                bezier // Smooth curve
                style={{
                    borderRadius: 16,
                }}
            />
        </View>
    );
}
