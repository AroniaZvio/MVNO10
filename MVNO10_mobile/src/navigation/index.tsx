import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ContactsScreen from '../screens/ContactsScreen';
import DialpadScreen from '../screens/DialpadScreen';
import TariffPlans from '../components/TariffPlans';
import TabBarIcon from '../components/TabBarIcon';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tabs.Navigator 
      initialRouteName="Dialpad"
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#0EA5E9',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          paddingBottom: 11,
          paddingTop: 11,
          height: 63,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 11,
          elevation: 7,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen 
        name="Account" 
        component={DashboardScreen} 
        options={{ 
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="account" color={color} size={size} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Dialpad" 
        component={DialpadScreen} 
        options={{ 
          title: 'Dialpad',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="dialpad" color={color} size={size} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="Contacts" 
        component={ContactsScreen} 
        options={{ 
          title: 'Contacts',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="contacts" color={color} size={size} />
          ),
        }} 
      />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen 
              name="TariffPlans" 
              component={TariffPlans} 
              options={{ 
                headerShown: true, 
                title: 'Tariff Plans',
                headerStyle: { 
                  backgroundColor: '#0EA5E9',
                },
                headerTintColor: 'white',
                headerTitleStyle: { 
                  fontWeight: '700',
                  fontSize: 18,
                },
                headerShadowVisible: true,
              }} 
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
