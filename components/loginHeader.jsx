import { Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const loginHeader = () => {
    const router = useRouter()

    return (
        <View>
            <View className="bg-[#3C80B4] pb-12">
                <View className="flex-row items-center justify-between pl-10 pt-10">
                    <Text className="text-white text-[32px] font-bold text-center">EasyPOS</Text>
                </View>
            </View>
            <View className="bg-white rounded-t-[65px] pb-4">
                {/* Login/Register Tabs */}
                <View className="flex-row justify-center mt-4 py-12">
                    <TouchableOpacity className="border-b-2 border-[#3C80B4] px-4 pb-2"
                    onPress={() => router.push('/auth/login')}>
                        <Text className="text-[#3C80B4] text-xl font-semibold">Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="px-4 pb-2" onPress={() => router.push('/auth/register')}>
                        <Text className="text-gray-500 text-xl">Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default loginHeader