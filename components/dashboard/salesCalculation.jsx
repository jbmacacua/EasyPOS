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
  const [chartData, setChartData] = useState({ values: [], labels: [] });
  const [totalSales, setTotalSales] = useState(0);
  const [selectedDay, setSelectedDay] = useState(day);
const [selectedWeek, setSelectedWeek] = useState(currentWeek);
const [selectedMonth, setSelectedMonth] = useState(month + 1);


  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        if (activeTab === "Daily") {
          const now = new Date();
          const selectedDate = new Date(now.getFullYear(), now.getMonth(), Number(selectedDay));
          const formattedDate = selectedDate.toLocaleDateString("en-CA");
          const result = await getTotalSalesForDay(userId, businessId, formattedDate);
  
          if (result.success) {
            const breakdown = result.salesByInterval || [];
            const values = breakdown.map((entry) => entry.total || 0);
            const labels = breakdown.map((entry) => entry.interval || "");
            const calculatedTotal = values.reduce((sum, val) => sum + val, 0);
            setChartData({ values, labels });
            setTotalSales(calculatedTotal);

            console.log("Daily sales result:", result);
          }
        } else if (activeTab === "Weekly") {
          const result = await getTotalSalesForWeek(userId, businessId, parseInt(selectedWeek));
        
          console.log("Weekly sales result:", result);
        
          if (result.success && result.result?.dailySales) {
            const breakdown = result.result.dailySales;
        
            const sortedBreakdown = breakdown.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );
        
            const values = sortedBreakdown.map((entry) => entry.total_income || 0);
            const labels = sortedBreakdown.map((entry) => {
              const date = new Date(entry.date);
              return date.toLocaleDateString("en-US", { weekday: "short" }); // e.g., "Mon", "Tue"
            });
            
        
            console.log("Weekly chart values:", values);
            console.log("Weekly chart labels:", labels);
        
            setChartData({ values, labels });
            setTotalSales(result.result.totalSales || 0);
          } else {
            setChartData({ values: [], labels: [] });
            setTotalSales(0);
          }
        
         
        } else if (activeTab === "Monthly") {
          const result = await getTotalSalesForMonth(userId, businessId);
          if (result.success) {
            const breakdown = result.salesByWeek || [];
            const values = breakdown.map((entry) => entry.total || 0);
            const labels = breakdown.map((entry) => entry.week || "");
            setChartData({ values, labels });
            setTotalSales(result.total || 0);
          }
        }
      } catch (error) {
        console.error("Sales fetch error:", error);
        setChartData({ values: [], labels: [] });
        setTotalSales(0);
      }
      setLoading(false);
    };
  
    if (activeTab === "Daily") {
      fetchSales();
    } else if (activeTab === "Weekly") {
      fetchSales();
    } else if (activeTab === "Monthly") {
      fetchSales();
    }
  }, [activeTab, selectedDay, selectedWeek, selectedMonth]);
  

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
                activeTab === "Daily"
                  ? `Day ${selectedDay}`
                  : `Week ${selectedWeek}`
              }
              onChange={(option) => {
                if (activeTab === "Daily") {
                  setSelectedDay(Number(option.key));
                } else if (activeTab === "Weekly") {
                  setSelectedWeek(Number(option.key));
                }
              }}
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
                  {activeTab === "Daily" ? `Day ${selectedDay}` : `Week ${selectedWeek}`}
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
            labels: chartData.labels.length > 0 ? chartData.labels : ["No data"],
            datasets: [{ data: chartData.values.length > 0 ? chartData.values : [0], strokeWidth: 2 }],
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
