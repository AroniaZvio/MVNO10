import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TabBarIconProps {
  name: string;
  color: string;
  size: number;
}

export default function TabBarIcon({ name, color, size }: TabBarIconProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'account':
        return '👤';
      case 'dialpad':
        return '📱';
      case 'contacts':
        return '👥';
      default:
        return '📱';
    }
  };

  return (
    <Text style={[styles.icon, { color, fontSize: size }]}>
      {getIcon(name)}
    </Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    textAlign: 'center',
  },
});
