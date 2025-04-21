import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importing MaterialIcons from react-native-vector-icons

// Helper function to calculate the number of days, weeks, and months
const getDaysAndWeeks = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalWeeks = Math.ceil((daysInMonth + firstDayOfMonth) / 7);

    // Calculate the current week of the month
    const currentWeek = Math.ceil((day + firstDayOfMonth) / 7);

    return { daysInMonth, totalWeeks, day, currentWeek, month };
};

export default function SalesCalculation({ activeTab }) {
    const screenWidth = Dimensions.get("window").width;
    const { daysInMonth, totalWeeks, day, currentWeek, month } = getDaysAndWeeks();
    const [selectedFilter, setSelectedFilter] = useState(1); // Default to the first filter option

    const dailySalesData = [823, 1187, 1023, 1578, 2124, 1389, 954, 1097, 1932]; // Simulated sales data with exact numbers
    const dailyCostOfGoods = [500, 720, 600, 900, 1100, 750, 480, 570, 1050]; // Estimated cost of goods for daily sales
    const dailyIncomeData = dailySalesData.map((sales, i) => sales - dailyCostOfGoods[i]); // Income calculation for daily sales

    const weeklySalesData = [9023, 11478, 8475, 10456, 9812, 10189, 10987]; // More precise weekly sales figures
    const weeklyCostOfGoods = [5000, 6200, 4800, 5500, 5300, 5400, 5900]; // Estimated cost of goods for weekly sales
    const weeklyIncomeData = weeklySalesData.map((sales, i) => sales - weeklyCostOfGoods[i]); // Income calculation for weekly sales

    const monthlySalesData = [28145, 39123, 33267, 41289]; // Realistic monthly sales variations with exact figures
    const monthlyCostOfGoods = [15000, 21000, 18000, 22000]; // Estimated cost of goods for monthly sales
    const monthlyIncomeData = monthlySalesData.map((sales, i) => sales - monthlyCostOfGoods[i]); // Income calculation for monthly sales

    // Reset selectedFilter when activeTab changes
    useEffect(() => {
        if (activeTab === "Daily") {
            setSelectedFilter(day); // Default to today's day
        } else if (activeTab === "Weekly") {
            setSelectedFilter(currentWeek); // Default to the current week of the month
        } else if (activeTab === "Monthly") {
            setSelectedFilter(month + 1); // Default to the current month (1-based)
        }
    }, [activeTab, day, currentWeek, month]);

    // Function to get the filtered data based on the active tab
    const getFilteredData = () => {
        let data = [];

        if (activeTab === "Daily") {
            data = dailyIncomeData;
        } else if (activeTab === "Weekly") {
            data = weeklyIncomeData;
        } else if (activeTab === "Monthly") {
            data = monthlyIncomeData;
        }

        // If no data, return [0] to prevent errors
        return data.length > 0 ? data : [0];
    };

    // Calculate total sales for the filtered data
    const calculateTotal = () => {
        const data = getFilteredData();
        return data.reduce((total, value) => total + value, 0);
    };

    // Generate filter options for daily/weekly tabs
    const generateFilterOptions = () => {
        if (activeTab === "Daily") {
            return Array.from({ length: daysInMonth }, (_, i) => ({
                label: `Day ${i + 1}`,
                key: `${i + 1}`,
            }));
        } else if (activeTab === "Weekly") {
            return Array.from({ length: totalWeeks }, (_, i) => ({
                label: `Week ${i + 1}`,
                key: `${i + 1}`,
            }));
        }
        return [];
    };

    // Generate labels for the chart based on the active tab
    const generateChartLabels = () => {
        if (activeTab === "Daily") {
            return ["1hr", "5hrs", "10hrs", "15hrs", "20hrs", "25hrs"];
        } else if (activeTab === "Weekly") {
            return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        } else if (activeTab === "Monthly") {
            return ["Week 1", "Week 2", "Week 3", "Week 4"];
        }
        return [];
    };

    return (
        <View className="bg-white p-5 rounded-lg shadow-md">
            <View className="mb-4 flex-row justify-between items-center">
                {/* Header with total sales */}
                <View className="w-1/2">
                    <Text className="text-[15px] font-bold text-[#3C80B4]">Income Calculation</Text>
                    <Text className="text-[13px] text-[#3C80B4]">
                        Total Income: P{calculateTotal()}
                    </Text>
                </View>

                {/* Filter dropdown for daily/weekly tabs */}
                {activeTab !== "Monthly" && (
                    <View>
                        <ModalSelector
                            data={generateFilterOptions()}
                            initValue={activeTab === "Daily" ? `Day ${selectedFilter}` : `Week ${selectedFilter}`}
                            onChange={(option) => setSelectedFilter(option.key)}
                            style={{
                                width: 100,
                                backgroundColor: "#3C80B4",
                                borderRadius: 25,
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
                                backgroundColor: "#3F89C1",
                                borderRadius: 25,
                            }}
                            selectTextStyle={{
                                color: "white",
                                fontSize: 16,
                            }}>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-white text-base ml-3">
                                    {activeTab === "Daily" ? `Day ${selectedFilter}` : `Week ${selectedFilter}`}
                                </Text>
                                <Icon name="arrow-drop-down" size={24} color="white" className="mr-3" />
                            </View>
                        </ModalSelector>
                    </View>
                )}
            </View>

            {/* Line Chart */}
            <View className="items-center">
                <LineChart
                    data={{
                        labels: generateChartLabels(),
                        datasets: [
                            {
                                data: getFilteredData(),
                                strokeWidth: 2,
                            },
                        ],
                    }}
                    width={screenWidth * 0.8}
                    height={200}
                    yAxisLabel="P"
                    yAxisInterval={1}
                    segments={8}
                    fromZero={true}
                    chartConfig={{
                        backgroundColor: "#F5F5F5",
                        backgroundGradientFrom: "#F5F5F5",
                        backgroundGradientTo: "#F5F5F5",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(28, 84, 126, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(28, 84, 126, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: "2",
                            strokeWidth: "3",
                            stroke: "#1C547E",
                        },
                        propsForVerticalLabels: {
                            fontSize: 12,
                        },
                    }}
                    style={{
                        borderRadius: 16,
                    }}
                />
            </View>
        </View>
    );
}
