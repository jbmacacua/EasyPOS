import React from 'react'
import { Tabs } from "expo-router"

const DashboardLayout = () => {
    return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }} />
}

export default DashboardLayout