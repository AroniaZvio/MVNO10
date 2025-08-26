import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { userApi, planApi } from '../services/api';
import type { DashboardResponse, PhoneNumber, UserPlan } from '../types/api';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const { user, logout, reloadProfile } = useAuth();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [currentPlan, setCurrentPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [dashboardData, planData] = await Promise.all([
        userApi.getDashboard(),
        planApi.getUserPlan().catch(() => null) // User might not have a plan
      ]);
      setData(dashboardData);
      setCurrentPlan(planData);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0EA5E9" />
      <Text style={styles.loadingText}>Loading your account...</Text>
    </View>
  );
  
  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const balance = data?.user?.balance ?? 0;
  const connected = (data?.connectedNumbers ?? []) as PhoneNumber[];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Account Balance</Text>
            <TouchableOpacity onPress={reloadProfile} style={styles.refreshButton}>
              <Text style={styles.refreshButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>{balance.toFixed(2)} ₾</Text>
          <Text style={styles.balanceSubtext}>Available for services and plans</Text>
        </View>

        {/* Current Plan Card */}
        {currentPlan && (
          <View style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>Current Plan</Text>
              <View style={styles.planStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <Text style={styles.planName}>{currentPlan.planName}</Text>
            <View style={styles.planFeatures}>
              <View style={styles.planFeature}>
                <Text style={styles.featureIcon}>📱</Text>
                <Text style={styles.featureText}>
                  {currentPlan.planDataMb >= 1024 
                    ? `${(currentPlan.planDataMb / 1024).toFixed(1)} GB` 
                    : `${currentPlan.planDataMb} MB`
                  }
                </Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.featureIcon}>📞</Text>
                <Text style={styles.featureText}>{currentPlan.planMinutes} min</Text>
              </View>
              <View style={styles.planFeature}>
                <Text style={styles.featureIcon}>💬</Text>
                <Text style={styles.featureText}>{currentPlan.planSms} SMS</Text>
              </View>
            </View>
            <View style={styles.planPriceContainer}>
              <Text style={styles.planPrice}>${parseFloat(currentPlan.planPrice).toFixed(2)}</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('TariffPlans')}
            >
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>
                {currentPlan ? 'Manage Plans' : 'Choose Plan'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('TariffPlans')}
            >
              <Text style={styles.actionIcon}>🔢</Text>
              <Text style={styles.actionText}>Get Number</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Connected Numbers */}
        <View style={styles.numbersCard}>
          <View style={styles.numbersHeader}>
            <Text style={styles.sectionTitle}>Connected Numbers</Text>
            <Text style={styles.numbersCount}>{connected.length}</Text>
          </View>
          
          {connected.length > 0 ? (
            connected.map((item, index) => (
              <View key={item.id} style={styles.numberItem}>
                <View style={styles.numberInfo}>
                  <Text style={styles.numberText}>
                    {item.mobileNumber || item.number800}
                  </Text>
                  <Text style={styles.countryText}>
                    {item.countryName || item.countryCode || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.numberStatus}>
                  <View style={styles.activeDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyNumbers}>
              <Text style={styles.emptyIcon}>📱</Text>
              <Text style={styles.emptyTitle}>No numbers yet</Text>
              <Text style={styles.emptySubtext}>
                Get your first virtual number to start making calls
              </Text>
              <TouchableOpacity 
                style={styles.getNumberButton}
                onPress={() => navigation.navigate('TariffPlans')}
              >
                <Text style={styles.getNumberButtonText}>Get Number</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 22,
    paddingBottom: 36,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 11,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 18,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0EA5E9',
    marginBottom: 7,
  },
  balanceSubtext: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  planFeatures: {
    marginBottom: 20,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  featureText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  planPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
  },
  planPeriod: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 4,
  },
  quickActionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  numbersCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  numbersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  numbersCount: {
    backgroundColor: '#0EA5E9',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  numberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  numberInfo: {
    flex: 1,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  countryText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  numberStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  emptyNumbers: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  getNumberButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  getNumberButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
