import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();

// Простые экраны для демонстрации
const HomeScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Главная</Text>
    <Text style={styles.subtitle}>Добро пожаловать в MVNO приложение!</Text>
  </View>
);

const TariffsScreen: React.FC = () => (
  <View style={styles.screen}>
    <Text style={styles.title}>Тарифы</Text>
    <Text style={styles.subtitle}>Здесь будут отображаться доступные тарифы</Text>
  </View>
);

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Профиль</Text>
      <Text style={styles.subtitle}>Пользователь: {user?.firstName} {user?.lastName}</Text>
      <Text style={styles.subtitle}>Email: {user?.email}</Text>
      <Text style={styles.subtitle}>Телефон: {user?.phoneNumber}</Text>
    </View>
  );
};

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#666',
        headerShown: true,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Главная',
          tabBarLabel: 'Главная',
        }}
      />
      <Tab.Screen 
        name="Tariffs" 
        component={TariffsScreen}
        options={{
          title: 'Тарифы',
          tabBarLabel: 'Тарифы',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Профиль',
          tabBarLabel: 'Профиль',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
});

export default MainNavigator;
