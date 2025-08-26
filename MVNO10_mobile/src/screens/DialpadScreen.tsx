import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DialpadScreen() {
  const { user } = useAuth();
  const [dialedNumber, setDialedNumber] = useState('');
  const [userBalance, setUserBalance] = useState(0);
  const [userNumber, setUserNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  // Load user data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      // In a real app, this would fetch from API
      // For now, using mock data
      setUserBalance(12.50);
      setUserNumber('+995 555 123 456');
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const addDigit = (digit: string) => {
    if (dialedNumber.length < 15) { // Limit phone number length
      setDialedNumber(prev => prev + digit);
      // In a real app, you would add haptic feedback here
      console.log('Added digit:', digit);
    }
  };

  const deleteLastDigit = () => {
    if (dialedNumber.length > 0) {
      setDialedNumber(prev => prev.slice(0, -1));
      // In a real app, you would add haptic feedback here
      console.log('Deleted last digit');
    }
  };

  const clearNumber = () => {
    setDialedNumber('');
  };

  const handleCall = () => {
    if (!dialedNumber.trim()) {
      Alert.alert('No Number', 'Please enter a phone number to call.');
      return;
    }

    setIsCalling(true);
    Alert.alert(
      'Making Call',
      `Calling ${dialedNumber}...`,
      [
        { 
          text: 'End Call', 
          onPress: () => {
            setIsCalling(false);
            console.log('Call ended');
          }
        }
      ]
    );
  };

  const handleVideoCall = () => {
    if (!dialedNumber.trim()) {
      Alert.alert('No Number', 'Please enter a phone number for video call.');
      return;
    }

    Alert.alert(
      'Video Call',
      `Starting video call with ${dialedNumber}...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Call', 
          onPress: () => console.log('Video call started with:', dialedNumber)
        }
      ]
    );
  };

  const formatBalance = (balance: number) => {
    return `${balance.toFixed(2)} ₾`;
  };

  const renderDialpadButton = (digit: string, letters?: string) => (
    <TouchableOpacity
      style={styles.dialpadButton}
      onPress={() => addDigit(digit)}
      activeOpacity={0.7}
    >
      <Text style={styles.dialpadDigit}>{digit}</Text>
      {letters && <Text style={styles.dialpadLetters}>{letters}</Text>}
    </TouchableOpacity>
  );

  const renderSpecialButton = (icon: string, action: () => void, style?: any) => (
    <TouchableOpacity
      style={[styles.dialpadButton, style]}
      onPress={action}
      activeOpacity={0.7}
    >
      <Text style={styles.specialButtonIcon}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with User Info */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Text style={styles.userNumber}>{userNumber}</Text>
          </View>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceAmount}>{formatBalance(userBalance)}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dialed Number Display */}
        <View style={styles.numberDisplay}>
          <Text style={[
            styles.dialedNumberText,
            !dialedNumber && styles.placeholderText
          ]}>
            {dialedNumber || 'Enter number'}
          </Text>
          {dialedNumber.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearNumber}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Dialpad Grid */}
        <View style={styles.dialpadContainer}>
          {/* Row 1: 1, 2, 3 */}
          <View style={styles.dialpadRow}>
            {renderDialpadButton('1')}
            {renderDialpadButton('2', 'ABC')}
            {renderDialpadButton('3', 'DEF')}
          </View>

          {/* Row 2: 4, 5, 6 */}
          <View style={styles.dialpadRow}>
            {renderDialpadButton('4', 'GHI')}
            {renderDialpadButton('5', 'JKL')}
            {renderDialpadButton('6', 'MNO')}
          </View>

          {/* Row 3: 7, 8, 9 */}
          <View style={styles.dialpadRow}>
            {renderDialpadButton('7', 'PQRS')}
            {renderDialpadButton('8', 'TUV')}
            {renderDialpadButton('9', 'WXYZ')}
          </View>

          {/* Row 4: *, 0, # */}
          <View style={styles.dialpadRow}>
            {renderSpecialButton('*', () => addDigit('*'), styles.starButton)}
            {renderDialpadButton('0', '+')}
            {renderSpecialButton('#', () => addDigit('#'), styles.hashButton)}
          </View>
        </View>

        {/* Call Actions */}
        <View style={styles.callActions}>
          {/* Video Call Button */}
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.videoCallButton,
              !dialedNumber.trim() && styles.actionButtonDisabled
            ]}
            onPress={handleVideoCall}
            disabled={!dialedNumber.trim()}
          >
            <Text style={styles.actionButtonIcon}>📹</Text>
            <Text style={styles.actionButtonText}>Video</Text>
          </TouchableOpacity>

          {/* Main Call Button */}
          <TouchableOpacity 
            style={[
              styles.mainCallButton, 
              isCalling && styles.mainCallButtonActive,
              !dialedNumber.trim() && styles.mainCallButtonDisabled
            ]}
            onPress={handleCall}
            disabled={!dialedNumber.trim()}
          >
            <Text style={styles.mainCallIcon}>
              {isCalling ? '📞' : '📞'}
            </Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity 
            style={[
              styles.actionButton,
              styles.deleteButton,
              !dialedNumber.length && styles.actionButtonDisabled
            ]}
            onPress={deleteLastDigit}
            disabled={!dialedNumber.length}
          >
            <Text style={styles.actionButtonIcon}>⌫</Text>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📞</Text>
            <Text style={styles.quickActionText}>Recent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionText}>Contacts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>⭐</Text>
            <Text style={styles.quickActionText}>Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Call History Preview */}
        <View style={styles.callHistoryPreview}>
          <View style={styles.callHistoryHeader}>
            <Text style={styles.callHistoryTitle}>Recent Calls</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.callHistoryItem}>
            <View style={styles.callHistoryInfo}>
              <Text style={styles.callHistoryNumber}>+995 555 789 012</Text>
              <Text style={styles.callHistoryTime}>2 min ago</Text>
            </View>
            <TouchableOpacity style={styles.callAgainButton}>
              <Text style={styles.callAgainText}>📞</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.callHistoryItem}>
            <View style={styles.callHistoryInfo}>
              <Text style={styles.callHistoryNumber}>+995 555 456 789</Text>
              <Text style={styles.callHistoryTime}>1 hour ago</Text>
            </View>
            <TouchableOpacity style={styles.callAgainButton}>
              <Text style={styles.callAgainText}>📞</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 54,
    paddingBottom: 12,
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
    alignItems: 'flex-start',
  },
  userNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  balanceInfo: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0EA5E9',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 0,
    paddingBottom: 36,
  },
  numberDisplay: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 0,
    marginTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 11,
    elevation: 4,
  },
  dialedNumberText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  placeholderText: {
    color: '#94A3B8',
    fontWeight: '500',
  },
  clearButton: {
    padding: 11,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    width: 43,
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearButtonText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
  },
  dialpadContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 11,
    elevation: 4,
  },
  dialpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dialpadButton: {
    width: 72,
    height: 72,
    backgroundColor: '#F8FAFC',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dialpadDigit: {
    fontSize: 29,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  dialpadLetters: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  starButton: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  hashButton: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  specialButtonIcon: {
    fontSize: 28,
    color: '#374151',
    fontWeight: '600',
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    minWidth: 80,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  videoCallButton: {
    borderColor: '#10B981',
  },
  actionButtonIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  mainCallButton: {
    width: 80,
    height: 80,
    backgroundColor: '#10B981',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  mainCallButtonActive: {
    backgroundColor: '#EF4444',
    transform: [{ scale: 1.1 }],
  },
  mainCallButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  mainCallIcon: {
    fontSize: 32,
    color: 'white',
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  quickActionButton: {
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  callHistoryPreview: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  callHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  callHistoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0EA5E9',
  },
  callHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  callHistoryInfo: {
    flex: 1,
  },
  callHistoryNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  callHistoryTime: {
    fontSize: 14,
    color: '#64748B',
  },
  callAgainButton: {
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  callAgainText: {
    fontSize: 20,
  },
});
