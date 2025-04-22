import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Header from '@ui/header';

const ProductDetails = () => {
  const { id, name, barCode, price, stockLeft, imageUrl } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View className="bg-[#3F89C1] flex-1">
      <Header />
      <View className="flex-1 bg-white rounded-t-[65px] px-6 py-6">
        <View className="items-start w-full">

          <View className="w-full items-center my-4">
            {imageUrl && <Image source={{ uri: imageUrl }} className="w-48 h-48 rounded-lg" />}
          </View>

          <View className="ml-2 self-start">
            <Text className="text-2xl font-bold mb-4">{name || 'Product Name'}</Text>
            <Text className="text-lg mb-2">
              Bar Code No: <Text className="font-bold">{barCode || 'N/A'}</Text>
            </Text>
            <Text className="text-lg mb-2">
              Price: <Text className="font-bold">Php {price || '0'}</Text>
            </Text>
            <Text className="text-lg">
              Stocks Left: <Text className="font-bold">{stockLeft || '0'}</Text>
            </Text>
          </View>

          <TouchableOpacity
            className="bg-[#007DA5] py-3 rounded-2xl w-full self-center mt-16"
            onPress={() => router.push(`/main/inventory/${id}/edit`)}
          >
            <Text className="text-white text-center font-semibold text-lg">Edit details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#007DA5] py-3 rounded-2xl w-full self-center mt-4"
            onPress={router.back}
          >
            <Text className="text-white text-center font-semibold text-lg">Back</Text>
          </TouchableOpacity>
          
          
        </View>
      </View>
    </View>
  );
};

export default ProductDetails;
