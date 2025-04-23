import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ModalSelector from "react-native-modal-selector";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTotalSalesForDay, getTotalSalesForWeek, getTotalSalesForMonth } from "@api/sales";

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

export default function SalesCalculation({ activeTab, userId, businessId }) {
  const screenWidth = Dimensions.get("window").width;
  const { daysInMonth, totalWeeks, day, currentWeek, month } = getDaysAndWeeks();

  const [selectedFilter, setSelectedFilter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    if (activeTab === "Daily") {
      setSelectedFilter(day);
    } else if (activeTab === "Weekly") {
      setSelectedFilter(currentWeek);
    } else if (activeTab === "Monthly") {
      setSelectedFilter(month + 1);
    }
  }, [activeTab, day, currentWeek, month]);

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      let result;

      if (activeTab === "Daily") {
        const now = new Date();
        const selectedDate = new Date(now.getFullYear(), now.getMonth(), Number(selectedFilter));
        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        result = await getTotalSalesForDay(userId, businessId, formattedDate);
      } else if (activeTab === "Weekly") {
        result = await getTotalSalesForWeek(userId, businessId, parseInt(selectedFilter));
        console.log("Weekly sales result:", result);
      } else if (activeTab === "Monthly") {
        result = await getTotalSalesForMonth(userId, businessId);
      }

      if (result.success) {
        const total = result.total || result.totalSales || result.result?.totalSales || 0;
        setTotalSales(total);
        const breakdown = result.breakdown || result.data || [];
        const values = breakdown.map((entry) => entry.sales || entry.total || entry.amount || 0);
        setChartData(values);
      } else {
        console.error("Sales fetch error:", result.error);
        setTotalSales(0);
        setChartData([]);
      }

      setLoading(false);
    };

    fetchSales();
  }, [activeTab, selectedFilter]);

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
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    } else if (activeTab === "Monthly") {
      return ["Week 1", "Week 2", "Week 3", "Week 4"];
    }
    return [];
  };

  return (
    <View className="bg-white p-5 rounded-lg shadow-md">
      <View className="mb-4 flex-row justify-between items-center">
        <View className="w-1/2">
          <Text className="text-[15px] font-bold text-[#3C80B4]">Sales Calculation</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#3C80B4" />
          ) : (
            <Text className="text-[13px] text-[#3C80B4]">
              Total Sales: P{totalSales}
            </Text>
          )}
        </View>

        {activeTab !== "Monthly" && (
          <View>
            <ModalSelector
              data={generateFilterOptions()}
              initValue={
                activeTab === "Daily" ? `Day ${selectedFilter}` : `Week ${selectedFilter}`
              }
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
            datasets: [{ data: chartData.length > 0 ? chartData : [0], strokeWidth: 2 }],
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
            style: { borderRadius: 16 },
            propsForDots: {
              r: "2",
              strokeWidth: "2",
              stroke: "#1C547E",
            },
            propsForVerticalLabels: { fontSize: 12 },
          }}
          style={{ borderRadius: 16 }}
        />
      </View>
    </View>
  );
}
