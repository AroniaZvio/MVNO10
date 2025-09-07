import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  number: string;
  name?: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  type: 'sms' | 'mms';
}

export default function MessagesScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        number: '+995 555 789 012',
        name: 'John Doe',
        lastMessage: 'Hey, how are you doing?',
        time: '2 min ago',
        unread: true,
        type: 'sms'
      },
      {
        id: '2',
        number: '+995 555 456 789',
        name: 'Jane Smith',
        lastMessage: 'Thanks for the call earlier!',
        time: '1 hour ago',
        unread: false,
        type: 'sms'
      },
      {
        id: '3',
        number: '+995 555 123 456',
        lastMessage: 'Meeting at 3 PM today',
        time: '3 hours ago',
        unread: true,
        type: 'sms'
      },
      {
        id: '4',
        number: '+995 555 987 654',
        name: 'Mike Johnson',
        lastMessage: 'Check out this photo 📸',
        time: 'Yesterday',
        unread: false,
        type: 'mms'
      },
      {
        id: '5',
        number: '+995 555 321 098',
        lastMessage: 'See you tomorrow!',
        time: 'Yesterday',
        unread: false,
        type: 'sms'
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMessages = messages.filter(message =>
    message.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.number.includes(searchQuery) ||
    message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return '💬';
      case 'mms':
        return '📷';
      default:
        return '💬';
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity style={[styles.messageItem, item.unread && styles.unreadMessage]}>
      <View style={styles.messageInfo}>
        <View style={styles.messageHeader}>
          <Text style={[styles.messageName, item.unread && styles.unreadText]}>
            {item.name || item.number}
          </Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        {item.name && (
          <Text style={styles.messageNumber}>{item.number}</Text>
        )}
        <View style={styles.messageContent}>
          <Text style={[styles.messageText, item.unread && styles.unreadText]}>
            {item.lastMessage}
          </Text>
          <View style={styles.messageMeta}>
            <Text style={styles.messageType}>
              {getMessageIcon(item.type)}
            </Text>
            {item.unread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>!</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Loading messages...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.composeButton}>
          <Text style={styles.composeButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesListContent}
      />

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>✏️</Text>
          <Text style={styles.quickActionText}>Compose</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionIcon}>📞</Text>
          <Text style={styles.quickActionText}>Call</Text>
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
  composeButton: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  composeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  messagesList: {
    flex: 1,
  },
  messagesListContent: {
    padding: 22,
  },
  messageItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  unreadMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  messageNumber: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#64748B',
    flex: 1,
    marginRight: 12,
  },
  unreadText: {
    fontWeight: '600',
    color: '#1E293B',
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageType: {
    fontSize: 16,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#0EA5E9',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
