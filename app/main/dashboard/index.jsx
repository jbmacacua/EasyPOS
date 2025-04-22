import React, { useState, useMemo, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Header from "@ui/header";
import SalesCalculation from "@dashboard/salesCalculation";
import IncomeCalculation from "@dashboard/incomeCalculation";
import MostSoldItems from "@dashboard/mostSoldItems";
import RestockItems from "@dashboard/restockItems";
import Tabs from "@ui/tabs";
import { useSession } from "@context/auth";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Daily");

  const { session, businessId } = useSession();

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn("Failed to parse session:", error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />

      <View className="bg-white rounded-t-[65px] flex-1">
        <Text className="text-[#3C80B4] text-[20px] font-bold text-center py-5">Dashboard</Text>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <ScrollView contentContainerStyle={{ padding: 8 }}>
          <View className="mb-3 w-[95%] mx-auto">
            <SalesCalculation activeTab={activeTab} />
          </View>

          <View className="mb-3 w-[95%] mx-auto">
            <IncomeCalculation activeTab={activeTab} />
          </View>

          <View className="mb-3 w-[95%] mx-auto">
            <MostSoldItems activeTab={activeTab} userId={userId} businessId={businessId} />
          </View>

          <View className="mb-3 w-[95%] mx-auto">
            <RestockItems />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
