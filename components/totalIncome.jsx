import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // LineChart import
import { Dimensions } from 'react-native'; // For responsive width
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing MaterialIcons from react-native-vector-icons

export default function TotalIncome({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [yesterdayIncome, setYesterdayIncome] = useState(0);

    const screenWidth = Dimensions.get("window").width;

    // Function to generate random values with some fluctuation
    const getRandomFluctuation = (baseValue) => {
        const fluctuation = Math.random() * 30 - 15; // Fluctuate by -15 to +15
        return Math.max(0, baseValue + fluctuation); // Ensure no negative values
    };

    // Dummy data for each period with adjusted values ensuring weekly > daily and monthly > weekly (at least 4x)
    const dailyData = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Daily Product ${String.fromCharCode(65 + i)}`,
        sold: getRandomFluctuation(50 + i * 5), // Fluctuating values
    }));

    const weeklyData = Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Weekly Product ${String.fromCharCode(75 - i)}`,
        sold: getRandomFluctuation((50 + i * 5) * 5), // Ensuring at least 4x daily sales
    }));

    const monthlyData = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Monthly Product ${String.fromCharCode(85 + i)}`,
        sold: getRandomFluctuation((50 + i * 5) * 20), // Ensuring at least 4x weekly sales
    }));

    useEffect(() => {
        setLoading(true);

        let data = [];
        if (activeTab === 'Daily') {
            data = dailyData;
        } else if (activeTab === 'Weekly') {
            data = weeklyData;
        } else if (activeTab === 'Monthly') {
            data = monthlyData;
        }

        // Calculate total income based on the data
        const total = data.reduce((sum, product) => sum + product.sold * 10, 0); // Assuming $10 per product
        setTotalIncome(total.toFixed(2));

        // Simulate yesterday's income as 10% less than today's (just for example)
        const yesterdayTotal = total * 0.9;
        setYesterdayIncome(yesterdayTotal.toFixed(2));

        setTimeout(() => {
            setLoading(false);
        }, 1000); // Simulate network delay
    }, [activeTab]);

    // Calculate percentage change
    const percentageChange = ((totalIncome - yesterdayIncome) / yesterdayIncome) * 100;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View className="flex-1">
            <View className="p-5 bg-white rounded-lg shadow-lg border border-[#A6A6A6]">
                {/* Total Income and Percentage Change */}
                <View className="flex-row justify-between">
                    <View className="w-[70%]">
                        <Text className="text-2xl font-bold mb-5 text-[#3C80B4]">Total Income</Text>
                        <Text className="text-3xl font-bold text-[#3C80B4] pb-1">Php {Number(totalIncome).toLocaleString()}</Text>
                        <Text className="text-sm text-gray-500">Php {Number(yesterdayIncome).toLocaleString()} previously</Text>
                    </View>
                    <View className="items-end w-[30%] p-1">
                        <View className="flex-row items-center bg-[#DCFCE7] rounded-xl">
                            <Icon name={percentageChange >= 0 ? 'arrow-upward' : 'arrow-downward'} className="pr-1" size={20} color={percentageChange >= 0 ? '#1C547E' : 'red'} />
                            <Text className={`text-base font-bold ${percentageChange >= 0 ? 'text-[#1C547E]' : 'text-red-500'}`}>
                                {percentageChange.toFixed(2)}%
                            </Text>
                        </View>
                        {/* Line Graph */}
                        <View className="items-center">
                            <LineChart
                                data={{
                                    labels: ["1hr", "5hrs", "10hrs", "15hrs", "20hrs", "25hrs"], // Placeholder labels for a week
                                    datasets: [{
                                        data: activeTab === 'Daily'
                                            ? dailyData.map((item) => item.sold)
                                            : activeTab === 'Weekly'
                                                ? weeklyData.map((item) => item.sold)
                                                : monthlyData.map((item) => item.sold),
                                        color: (opacity = 100) => `rgb(0, 125, 165)`, // Line color
                                        strokeWidth: 3,
                                    }]
                                }}
                                width={screenWidth * 0.4} // Responsive width
                                height={80} // Fixed height
                                withHorizontalLabels={false} // Hide horizontal labels
                                withVerticalLabels={false} // Hide vertical labels
                                withShadow={false} // No shadow
                                withHorizontalLines={false} // Hide horizontal lines
                                withVerticalLines={false} // Hide vertical lines
                                withDots={false} // Hide dots
                                bezier // Smooth line
                                chartConfig={{
                                    backgroundGradientFrom: "#fff",
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientTo: "#fff",
                                    backgroundGradientToOpacity: 0,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(28, 84, 126, ${opacity})`, // Axis color
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
                                    style: {
                                        borderRadius: 16,
                                        borderColor: 'transparent', // No border color
                                    }
                                }}
                            />
                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
}
