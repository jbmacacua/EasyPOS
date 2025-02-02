import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from "expo-router"
import Settings from './settings'

const AppLayout = () => {
  return (
	<Stack screenOptions={{headerShown: false}} >
		<Stack.Screen name="auth" />
		<Stack.Screen name="main" />
		<Stack.Screen name="settings" components={Settings}/>
	</Stack>
  )
}

export default AppLayout