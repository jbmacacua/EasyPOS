import React, { useMemo, useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { useSession } from '@context/auth';
import { deleteEmployee, getAllEmployees } from '../../../api/accounts';

export default function ChangeEmployeeRoleScreen() {
  const { session, businessId } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Hardcoded employee ID for testing (replace with actual Supabase user_id)
  const hardcodedEmployeeId = '2ec54bf7-37ca-4df6-b25c-bf9775cf87a5';

  const parsedSession = useMemo(() => {
    try {
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.warn('Failed to parse session:', error);
      return null;
    }
  }, [session]);

  const userId = parsedSession?.user?.id;

  const handleDeleteEmployee = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      const res = await deleteEmployee(userId, hardcodedEmployeeId, businessId);

      if (res.success) {
        setResult('✅ Employee deleted successfully!');
      } else {
        setResult(`❌ Failed: ${res.error.message || res.error}`);
      }
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetAllEmployees = async () => {
    if (!userId || !businessId) {
      setResult('❌ User or Business ID is missing');
      return;
    }

    setLoading(true);
    setResult('');

    const page = 1
    const limit = 10

    try {
      const res = await getAllEmployees(userId, businessId, page, limit);

      if (res.success) {
        const employeeDetails = res.result
          .map((item, idx) => `#${idx + 1}: ${item.firstName} ${item.lastName} (Role: ${item.role})`)
          .join('\n');
        setResult(`✅ Employees:\n${employeeDetails}`);
      } else {
        setResult(`❌ Failed: ${res.error.message || res.error}`);
      }
    } catch (err) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>
        👥 Employee Actions Tester
      </Text>

      <Text style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
        🔒 Hardcoded Employee ID: {hardcodedEmployeeId}
      </Text>

      <View style={{ marginBottom: 12 }}>
        <Button
          title={loading ? 'Deleting...' : '🗑️ Delete Employee'}
          onPress={handleDeleteEmployee}
          disabled={loading}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Button
          title={loading ? 'Fetching...' : '👁️ View All Employees'}
          onPress={handleGetAllEmployees}
          disabled={loading}
        />
      </View>

      {result !== '' && (
        <Text style={{ marginTop: 24, fontSize: 16, textAlign: 'center', color: '#333', whiteSpace: 'pre-line' }}>
          {result}
        </Text>
      )}
    </ScrollView>
  );
}
