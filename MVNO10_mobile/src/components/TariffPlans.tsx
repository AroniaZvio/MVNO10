import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { planApi } from '../services/api';
import type { Plan, UserPlan } from '../types/api';

export default function TariffPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, userPlanData] = await Promise.all([
        planApi.getPlans(),
        planApi.getUserPlan().catch(() => null) // User might not have a plan
      ]);
      
      setPlans(plansData);
      setUserPlan(userPlanData);
    } catch (error: any) {
      console.error('Failed to load plans:', error);
      Alert.alert('Error', 'Failed to load tariff plans');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleConnectPlan = async (plan: Plan) => {
    if (userPlan) {
      Alert.alert(
        'Plan Already Connected',
        `You already have an active plan: ${userPlan.planName}. Do you want to change it?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Change Plan', onPress: () => connectPlan(plan.id) }
        ]
      );
    } else {
      connectPlan(plan.id);
    }
  };

  const connectPlan = async (planId: number) => {
    try {
      setConnecting(true);
      const result = await planApi.connectPlan(planId);
      setUserPlan(result);
      Alert.alert('Success', `Plan "${result.planName}" connected successfully!`);
      loadData(); // Reload to get updated data
    } catch (error: any) {
      console.error('Failed to connect plan:', error);
      Alert.alert('Error', 'Failed to connect plan. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `$${numPrice.toFixed(2)}`;
  };

  const formatData = (mb: number) => {
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb} MB`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0A7B75" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Tariff Plans</Text>
        
        {/* Current Plan */}
        {userPlan && (
          <View style={styles.currentPlanCard}>
            <Text style={styles.currentPlanTitle}>Current Plan</Text>
            <Text style={styles.planName}>{userPlan.planName}</Text>
            <Text style={styles.planDescription}>{userPlan.planDescription}</Text>
            <View style={styles.planDetails}>
              <Text style={styles.planDetail}>📱 {formatData(userPlan.planDataMb)}</Text>
              <Text style={styles.planDetail}>📞 {userPlan.planMinutes} min</Text>
              <Text style={styles.planDetail}>💬 {userPlan.planSms} SMS</Text>
              <Text style={styles.planPrice}>{formatPrice(userPlan.planPrice)}/month</Text>
            </View>
            <Text style={styles.connectedDate}>Connected: {new Date(userPlan.connectedAt).toLocaleDateString()}</Text>
          </View>
        )}

        {/* Available Plans */}
        <Text style={styles.sectionTitle}>Available Plans</Text>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{formatPrice(plan.price)}/month</Text>
            </View>
            
            {plan.description && (
              <Text style={styles.planDescription}>{plan.description}</Text>
            )}
            
            <View style={styles.planFeatures}>
              <Text style={styles.planFeature}>📱 {formatData(plan.dataMb)}</Text>
              <Text style={styles.planFeature}>📞 {plan.minutes} min</Text>
              <Text style={styles.planFeature}>💬 {plan.sms} SMS</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.connectButton,
                userPlan?.planId === plan.id && styles.currentPlanButton
              ]}
              onPress={() => handleConnectPlan(plan)}
              disabled={connecting || userPlan?.planId === plan.id}
            >
              <Text style={styles.connectButtonText}>
                {userPlan?.planId === plan.id 
                  ? 'Current Plan' 
                  : connecting 
                    ? 'Connecting...' 
                    : 'Connect Plan'
                }
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {plans.length === 0 && (
          <Text style={styles.noPlansText}>No tariff plans available</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32, // Add extra bottom padding for better scrolling
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8fb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0A7B75',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0A7B75',
    marginTop: 24,
    marginBottom: 16,
  },
  currentPlanCard: {
    backgroundColor: '#0A7B75',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  currentPlanTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A7B75',
  },
  planDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  planDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'space-around',
  },
  planDetail: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    minWidth: '22%',
  },
  planFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  planFeature: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'center',
    minWidth: '22%',
  },
  connectButton: {
    backgroundColor: '#0A7B75',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  currentPlanButton: {
    backgroundColor: '#94a3b8',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  connectedDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  noPlansText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
