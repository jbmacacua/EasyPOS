import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { useMemo, useState } from 'react';
import { useSession } from '@context/auth';
import { editBusinessInformation, getBusinessDetails } from '../../../api/business';

export default function ApiTestScreen() {
  const { session, businessId } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [storeName, setStoreName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [address, setAddress] = useState('');

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn('Failed to parse session:', error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  const handleGetBusinessDetails = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing!');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const res = await getBusinessDetails(userId, businessId);
      if (res.success) {
        const { store_name, contact_number, email_address, address } = res.businessDetails;
        setStoreName(store_name);
        setContactNumber(contact_number);
        setEmailAddress(email_address);
        setAddress(address);
        setResult('✅ Business details loaded successfully!');
      } else {
        setResult(`❌ Failed to fetch details: ${res.error.message}`);
      }
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBusinessInfo = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing!');
      return;
    }

    if (!storeName || !contactNumber || !emailAddress || !address) {
      setResult('❌ All fields must be filled out!');
      return;
    }

    setLoading(true);
    setResult('');
    try {
      const res = await editBusinessInformation(
        storeName,
        contactNumber,
        emailAddress,
        address,
        userId,
        businessId
      );

      if (res.success) {
        setResult('✅ Business info updated successfully!');
      } else {
        setResult(`❌ Update failed: ${res.error.message}`);
      }
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold mb-4 text-center">🏪 Business API Test</Text>

      <TextInput
        value={storeName}
        onChangeText={setStoreName}
        placeholder="Store Name"
        className="mt-2 p-2 border border-gray-300 rounded"
      />
      <TextInput
        value={contactNumber}
        onChangeText={setContactNumber}
        placeholder="Contact Number"
        keyboardType="phone-pad"
        className="mt-2 p-2 border border-gray-300 rounded"
      />
      <TextInput
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email Address"
        keyboardType="email-address"
        className="mt-2 p-2 border border-gray-300 rounded"
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
        className="mt-2 p-2 border border-gray-300 rounded"
      />

      <Button
        title={loading ? 'Loading...' : '📥 Fetch Business Info'}
        onPress={handleGetBusinessDetails}
        disabled={loading}
      />
      <Button
        title={loading ? 'Saving...' : '💾 Save Business Info'}
        onPress={handleEditBusinessInfo}
        disabled={loading}
      />

      {result !== '' && (
        <Text className="mt-6 text-lg text-center text-gray-800">{result}</Text>
      )}
    </ScrollView>
  );
}
