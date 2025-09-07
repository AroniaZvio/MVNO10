import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface CallHistoryItem {
  id: string;
  number: string;
  name?: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration?: string;
}

export default function RecentScreen() {
  const { user } = useAuth();
  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for call history
  useEffect(() => {
    const mockCallHistory: CallHistoryItem[] = [
      {
        id: '1',
        number: '+995 555 789 012',
        name: 'John Doe',
        time: '2 min ago',
        type: 'outgoing',
        duration: '2:34'
      },
      {
        id: '2',
        number: '+995 555 456 789',
        name: 'Jane Smith',
        time: '1 hour ago',
        type: 'incoming',
        duration: '1:45'
      },
      {
        id: '3',
        number: '+995 555 123 456',
        time: '3 hours ago',
        type: 'missed'
      },
      {
        id: '4',
        number: '+995 555 987 654',
        name: 'Mike Johnson',
        time: 'Yesterday',
        type: 'outgoing',
        duration: '5:12'
      },
      {
        id: '5',
        number: '+995 555 321 098',
        time: 'Yesterday',
        type: 'incoming',
        duration: '0:45'
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setCallHistory(mockCallHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return '📞';
      case 'outgoing':
        return '📞';
      case 'missed':
        return '📞❌';
      default:
        return '📞';
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return '#10B981';
      case 'outgoing':
        return '#0EA5E9';
      case 'missed':
        return '#EF4444';
      default:
        return '#64748B';
    }
  };

  const renderCallItem = ({ item }: { item: CallHistoryItem }) => (
    <TouchableOpacity style={styles.callItem}>
      <View style={styles.callInfo}>
        <View style={styles.callHeader}>
          <Text style={styles.callNumber}>
            {item.name || item.number}
          </Text>
          <Text style={styles.callTime}>{item.time}</Text>
        </View>
        {item.name && (
          <Text style={styles.callNumberSecondary}>{item.number}</Text>
        )}
        <View style={styles.callDetails}>
          <Text style={[styles.callType, { color: getCallTypeColor(item.type) }]}>
            {getCallIcon(item.type)} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </Text>
          {item.duration && (
            <Text style={styles.callDuration}>{item.duration}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.callAgainButton}>
        <Text style={styles.callAgainIcon}>📞</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Loading call history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Calls</Text>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Call History List */}
      <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderCallItem}
        style={styles.callList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.callListContent}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📞</Text>
          <Text style={styles.quickActionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>💬</Text>
          <Text style={styles.quickActionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>👤</Text>
          <Text style={styles.quickActionText}>Contact</Text>
        </TouchableOpacity>
      </View>
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 54,
    paddingBottom: 22,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  clearButton: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  callList: {
    flex: 1,
  },
  callListContent: {
    padding: 22,
  },
  callItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  callInfo: {
    flex: 1,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  callNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  callNumberSecondary: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  callTime: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  callDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callType: {
    fontSize: 14,
    fontWeight: '600',
  },
  callDuration: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  callAgainButton: {
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginLeft: 12,
  },
  callAgainIcon: {
    fontSize: 20,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
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
});
