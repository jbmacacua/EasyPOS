import React from 'react'
import { Tabs } from "expo-router"

const SettingsLayout = () => {
    return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }} />
}

export default SettingsLayout