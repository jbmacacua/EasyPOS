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
    const currentWeek = Math.ceil((day + firstDayOfMonth) / 7);

    return { daysInMonth, totalWeeks, day, currentWeek, month };
};

const generateRandomPoints = (total, count = 6) => {
    const points = Array(count).fill(0);
    let remaining = total;

    for (let i = 0; i < count - 1; i++) {
        const value = Math.floor(Math.random() * (remaining / 2));
        points[i] = value;
        remaining -= value;
    }
    points[count - 1] = remaining;

    return points.sort(() => Math.random() - 0.5); 
};

export default function incomeCalculation({ activeTab, userId, businessId }) {
    const screenWidth = Dimensions.get("window").width;
    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const { daysInMonth, totalWeeks, day, currentWeek, month } = getDaysAndWeeks();
    const [selectedFilter, setSelectedFilter] = useState(1);

    const dailySalesData = [923, 1187, 1023, 1578, 2124, 1389, 954, 1097, 1932]; // Simulated sales data with exact numbers
    const dailyCostOfGoods = [500, 720, 600, 900, 1100, 750, 480, 570, 1050]; // Estimated cost of goods for daily sales
    const dailyIncomeData = dailySalesData.map((sales, i) => sales - dailyCostOfGoods[i]);
    useEffect(() => {
        if (activeTab === "Daily") {
            setSelectedFilter(day);
        } else if (activeTab === "Weekly") {
            setSelectedFilter(currentWeek);
        } else if (activeTab === "Monthly") {
            setSelectedFilter(month + 1);
        }
    }, [activeTab, day, currentWeek, month]);

    const getFilteredData = () => {
        let data = [];
        if (activeTab === "Daily") {
            data = dailyData;
        } else if (activeTab === "Weekly" && weeklyData?.length > 0) {
            data = weeklyData.map((item) => item.daily_profit);
        } else if (activeTab === "Monthly" && monthlyData?.length > 0) {
            data = monthlyData.map((item) => item.daily_profit);
        }
        return data.length > 0 ? data : [0];
    };

    const getDayOfWeek = (date) => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[new Date(date).getDay()];
    };

    useEffect(() => {
        const fetchProfit = async () => {
            setLoading(true);
            try {
                if (activeTab === "Daily") {
                    const date = new Date();
                    date.setDate(Number(selectedFilter));
                    const formattedDate = date.toISOString().split("T")[0];
                    console.log("Fetching daily profit for:", formattedDate);

                    const { success, total } = await getProfitForDay(userId, businessId, formattedDate);
                    if (success) {
                        setTotalIncome(total);
                        setDailyData(generateRandomPoints(total)); // Generate random points summing to total
                    }
                } else if (activeTab === "Weekly") {
                    const { success, result } = await getProfitForWeek(userId, businessId, Number(selectedFilter));
                    if (success) {
                        setTotalIncome(result.profit || 0);
                        setWeeklyData(result.dailyProfit);
                    }
                } else if (activeTab === "Monthly") {
                    const { success, result } = await getProfitForMonth(userId, businessId, Number(selectedFilter));
                    if (success) {
                        setTotalIncome(result.profit || 0);
                        setMonthlyData(result.weeklyProfit);
                    }
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

    const generateChartLabels = () => {
        if (activeTab === "Daily") {
            return ["1hr", "5hrs", "10hrs", "15hrs", "20hrs", "25hrs"];
        } else if (activeTab === "Weekly") {
            return weeklyData?.length > 0
                ? weeklyData.map((item) => getDayOfWeek(item.date))
                : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        } else if (activeTab === "Monthly") {
            return ["Week 1", "Week 2", "Week 3", "Week 4"];
        }
        return [];
    };

    return (
        <View className="bg-white p-5 rounded-lg shadow-md">
            <View className="mb-4 flex-row justify-between items-center">
                <View className="w-1/2">
                    <Text className="text-[15px] font-bold text-[#3C80B4]">Income Calculation</Text>
                    <Text className="text-[13px] text-[#3C80B4]">
                    Total Income: P{totalIncome.toFixed(2)}
                    </Text>
                </View>

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
                            }}
                        >
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
