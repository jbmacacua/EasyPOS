import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getProfitForDay, getProfitForWeek, getProfitForMonth, getTotalSalesByEmployee } from '@api/sales';
import { useSession } from '@context/auth';
import { useIsFocused } from '@react-navigation/native';

export default function TotalIncome({ activeTab }) {
    const [loading, setLoading] = useState(true);
    const [totalIncome, setTotalIncome] = useState(0);
    const [yesterdayIncome, setYesterdayIncome] = useState(0);
    const screenWidth = Dimensions.get('window').width;

    const { session, businessId, userRole } = useSession();
    const userId = session ? JSON.parse(session)?.user?.id : null;

    const isFocused = useIsFocused();

    const getRandomFluctuation = (baseValue) => {
        const fluctuation = Math.random() * 30 - 15;
        return Math.max(0, baseValue + fluctuation);
    };

    const dailyData = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Daily Product ${String.fromCharCode(65 + i)}`,
        sold: getRandomFluctuation(50 + i * 5),
    }));

    const weeklyData = Array.from({ length: 5 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Weekly Product ${String.fromCharCode(75 - i)}`,
        sold: getRandomFluctuation((50 + i * 5) * 5),
    }));

    const monthlyData = Array.from({ length: 8 }, (_, i) => ({
        id: (i + 1).toString(),
        name: `Monthly Product ${String.fromCharCode(85 + i)}`,
        sold: getRandomFluctuation((50 + i * 5) * 20),
    }));

    useEffect(() => {
        if (!isFocused) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'Daily') {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    const formatDate = (date) => date.toISOString().split('T')[0];

                    if (userRole === 'sales') {
                        const todayRes = await getTotalSalesByEmployee(userId, businessId);
                        if (todayRes.success) {
                            setTotalIncome(todayRes.total.toFixed(2));
                            setYesterdayIncome(0); // Set to 0 for now
                        } else {
                            throw todayRes.error;
                        }
                    } else {
                        const [todayRes, yesterdayRes] = await Promise.all([
                            getProfitForDay(userId, businessId, formatDate(today)),
                            getProfitForDay(userId, businessId, formatDate(yesterday)),
                        ]);

                        if (todayRes.success && yesterdayRes.success) {
                            setTotalIncome(todayRes.total.toFixed(2));
                            setYesterdayIncome(yesterdayRes.total.toFixed(2));
                        } else {
                            throw todayRes.error || yesterdayRes.error;
                        }
                    }
                } else if (activeTab === 'Weekly') {
                    const today = new Date();
                    const weekNumber = Math.ceil(today.getDate() / 7); // Approximation
                    const weekRes = await getProfitForWeek(userId, businessId, weekNumber);

                    if (weekRes.success) {
                        const total = weekRes.result.profit || 0;
                        setTotalIncome(total.toFixed(2));
                        setYesterdayIncome(0); // Set to 0 for now
                    } else {
                        throw weekRes.error;
                    }
                } else if (activeTab === 'Monthly') {
                    const monthRes = await getProfitForMonth(userId, businessId);

                    if (monthRes.success) {
                        const total = monthRes.result.profit || 0;
                        setTotalIncome(total.toFixed(2));
                        setYesterdayIncome(0); // Set to 0 for now
                    } else {
                        throw monthRes.error;
                    }
                }
            } catch (err) {
                console.error('Error fetching income:', err);
                setTotalIncome(0);
                setYesterdayIncome(0);
            }
            setLoading(false);
        };

        fetchData();
    }, [isFocused, activeTab]);

    const percentageChange =
        yesterdayIncome !== 0
            ? ((totalIncome - yesterdayIncome) / yesterdayIncome) * 100
            : 0;

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const chartData =
        activeTab === 'Daily'
            ? dailyData.map((item) => item.sold)
            : activeTab === 'Weekly'
            ? weeklyData.map((item) => item.sold)
            : monthlyData.map((item) => item.sold);

    return (
        <View className="flex-1">
            <View className="p-5 bg-white rounded-lg shadow-lg border border-[#A6A6A6]">
                <View className="flex-row justify-between">
                    <View className="w-[70%]">
                        <Text className="text-2xl font-bold mb-5 text-[#3C80B4]">Total Income</Text>
                        <Text className="text-3xl font-bold text-[#3C80B4] pb-1">
                            Php {Number(totalIncome).toLocaleString()}
                        </Text>
                        <Text className="text-sm text-gray-500">
                            Php {Number(yesterdayIncome).toLocaleString()} previously
                        </Text>
                    </View>
                    <View className="items-end w-[30%] p-1">
                        <View className="flex-row items-center bg-[#DCFCE7] rounded-xl">
                            <Icon
                                name={percentageChange >= 0 ? 'arrow-upward' : 'arrow-downward'}
                                size={20}
                                color={percentageChange >= 0 ? '#1C547E' : 'red'}
                            />
                            <Text
                                className={`text-base font-bold ${percentageChange >= 0 ? 'text-[#1C547E]' : 'text-red-500'}`}
                            >
                                {percentageChange.toFixed(2)}%
                            </Text>
                        </View>

                        <View className="items-center">
                            <LineChart
                                data={{
                                    labels: ['1hr', '5hrs', '10hrs', '15hrs', '20hrs', '25hrs'],
                                    datasets: [
                                        {
                                            data: chartData,
                                            color: () => `rgb(0, 125, 165)`,
                                            strokeWidth: 3,
                                        },
                                    ],
                                }}
                                width={screenWidth * 0.4}
                                height={80}
                                withHorizontalLabels={false}
                                withVerticalLabels={false}
                                withShadow={false}
                                withHorizontalLines={false}
                                withVerticalLines={false}
                                withDots={false}
                                bezier
                                chartConfig={{
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientTo: '#fff',
                                    backgroundGradientToOpacity: 0,
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(28, 84, 126, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                        borderColor: 'transparent',
                                    },
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}
