import { View, Text, Button, TextInput } from 'react-native';
import { useMemo, useState } from 'react';
import { useSession } from '@context/auth';
import { getTotalSalesForMonth, getProfitForMonth, getMostSoldItemsForMonth } from '@api/sales'; // Import the APIs

export default function ApiTestScreen() {
  const { session, businessId } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [weekNumber, setWeekNumber] = useState(1); // Default to week 1
  const [date, setDate] = useState('2025-04-18'); // Set a default date or allow user input

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn('Failed to parse session:', error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  // Function to fetch total sales for the week
  const handleGetTotalSalesForWeek = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing!');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const res = await getTotalSalesForMonth(userId, businessId);

      if (res.success) {
        setResult(`✅ Total sales for Week ${weekNumber}: ₱${res.totalSales}`);
      } else {
        setResult(`❌ Failed to fetch total sales: ${res.error.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch profit for the week
  const handleGetProfitForWeek = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing!');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const res = await getProfitForMonth(userId, businessId);

      if (res.success) {
        setResult(`✅ Profit for Week ${weekNumber}: ₱${res.profit}`);
      } else {
        setResult(`❌ Failed to fetch profit: ${res.error.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch most sold items for the week
  const handleGetMostSoldItemsForWeek = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing!');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const res = await getMostSoldItemsForMonth(userId, businessId);

      if (res.success) {
        setResult(`✅ Most sold items for Week ${weekNumber}: ${JSON.stringify(res.data, null, 2)}`);
      } else {
        setResult(`❌ Failed to fetch most sold items: ${res.error.message}`);
      }
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <Text className="text-2xl font-bold mb-6 text-center">💰 API Test for Week</Text>

      {/* Input for Week Number */}
      <TextInput
        value={String(weekNumber)}
        onChangeText={setWeekNumber}
        keyboardType="numeric"
        placeholder="Enter Week Number (1-4)"
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {/* Button to trigger Get Total Sales for Week */}
      <Button
        title={loading ? 'Fetching Total Sales...' : `Get Total Sales for Week ${weekNumber}`}
        onPress={handleGetTotalSalesForWeek}
        disabled={loading}
      />

      {/* Button to trigger Get Profit for Week */}
      <Button
        title={loading ? 'Fetching Profit...' : `Get Profit for Week ${weekNumber}`}
        onPress={handleGetProfitForWeek}
        disabled={loading}
      />

      {/* Button to trigger Get Most Sold Items for Week */}
      <Button
        title={loading ? 'Fetching Most Sold Items...' : `Get Most Sold Items for Week ${weekNumber}`}
        onPress={handleGetMostSoldItemsForWeek}
        disabled={loading}
      />

      {/* Display the result */}
      {result !== '' && (
        <Text className="mt-6 text-lg text-center text-gray-800">{result}</Text>
      )}
    </View>
  );
}
