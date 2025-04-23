import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getProfitForDay, getProfitForWeek, getProfitForMonth } from "@api/sales";

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

export default function incomeCalculation({ activeTab, userId, businessId }) {
    const screenWidth = Dimensions.get("window").width;
    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const { daysInMonth, totalWeeks, day, currentWeek, month } = getDaysAndWeeks();
    const [selectedFilter, setSelectedFilter] = useState(1); // Default to the first filter option

    const dailySalesData = [923, 1187, 1023, 1578, 2124, 1389, 954, 1097, 1932]; // Simulated sales data with exact numbers
    const dailyCostOfGoods = [500, 720, 600, 900, 1100, 750, 480, 570, 1050]; // Estimated cost of goods for daily sales
    const dailyIncomeData = dailySalesData.map((sales, i) => sales - dailyCostOfGoods[i]); // Income calculation for daily sales

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
        } else if (activeTab === "Weekly" && weeklyData?.length > 0) {
            data = weeklyData.map((item) => item.daily_profit);
        } else if (activeTab === "Monthly" && monthlyData?.length > 0) {
            data = monthlyData.map((item) => item.daily_profit);
        }

        // If no data, return [0] to prevent errors
        return data.length > 0 ? data : [0];
    };

    // Function to convert date to day of the week (e.g., "Mon", "Tue")
    const getDayOfWeek = (date) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const d = new Date(date);
        return days[d.getDay()]; // Returns the day of the week (Sun, Mon, etc.)
    };

    useEffect(() => {
        const fetchProfit = async () => {
            setLoading(true);
            try {
                if (activeTab === "Daily") {
                    const today = new Date();
                    const formattedDate = today.toISOString().split("T")[0];
                    const { success, total } = await getProfitForDay(userId, businessId, formattedDate);
                    if (success) setTotalIncome(total);
                } else if (activeTab === "Weekly") {
                    const { success, result } = await getProfitForWeek(userId, businessId, Number(selectedFilter));
                    console.log("Weekly profit result:", result);
                    if (success) {
                        setTotalIncome(result.profit || 0);
                        setWeeklyData(result.dailyProfit); 
                    }
                } else if (activeTab === "Monthly") {
                    const { success, result } = await getProfitForMonth(userId, businessId,  Number(selectedFilter));
                    console.log("Monthly profit result:", result);
                    if (success) 
                        setTotalIncome(result.profit || 0);
                    setMonthlyData(result.weeklyProfit); 
                }
            } catch (err) {
                console.error("Failed to fetch profit:", err);
                setTotalIncome(0);
            } finally {
                setLoading(false);
            }
        };

        if (userId && businessId) {
            fetchProfit();
        }
    }, [activeTab, selectedFilter, userId, businessId]);

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
            if (weeklyData?.length > 0) {
                return weeklyData.map((item) => getDayOfWeek(item.date)); // Day names dynamically
            }
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
                        Total Income: P{totalIncome}
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
                            },
                        ],
                    }}
                    width={screenWidth - 30}
                    height={220}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        </View>
    );
}
