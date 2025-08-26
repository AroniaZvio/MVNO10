import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, TextInput, FlatList, Modal, Alert, Dimensions } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  isFavorite: boolean;
  company?: string;
  notes?: string;
}

export default function ContactsScreen() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Mock data for demonstration - in real app this would come from API
  useEffect(() => {
    const mockContacts: Contact[] = [
      { 
        id: '1', 
        name: 'John Doe', 
        phoneNumber: '+1 (555) 123-4567', 
        email: 'john@example.com', 
        isFavorite: true,
        company: 'Tech Corp',
        notes: 'Lead developer, prefers email communication'
      },
      { 
        id: '2', 
        name: 'Jane Smith', 
        phoneNumber: '+1 (555) 987-6543', 
        email: 'jane@example.com', 
        isFavorite: false,
        company: 'Design Studio',
        notes: 'Creative director, available after 2 PM'
      },
      { 
        id: '3', 
        name: 'Mike Johnson', 
        phoneNumber: '+1 (555) 456-7890', 
        email: 'mike@example.com', 
        isFavorite: true,
        company: 'Marketing Inc',
        notes: 'Marketing manager, best contact method is phone'
      },
      { 
        id: '4', 
        name: 'Sarah Wilson', 
        phoneNumber: '+1 (555) 789-0123', 
        email: 'sarah@example.com', 
        isFavorite: false,
        company: 'Consulting Group',
        notes: 'Business consultant, responds quickly to SMS'
      },
      { 
        id: '5', 
        name: 'David Brown', 
        phoneNumber: '+1 (555) 321-0987', 
        email: 'david@example.com', 
        isFavorite: false,
        company: 'Finance Corp',
        notes: 'Financial advisor, office hours 9 AM - 5 PM'
      },
      { 
        id: '6', 
        name: 'Lisa Davis', 
        phoneNumber: '+1 (555) 654-3210', 
        email: 'lisa@example.com', 
        isFavorite: true,
        company: 'HR Solutions',
        notes: 'HR manager, handles recruitment'
      },
    ];
    
    setContacts(mockContacts);
    setFilteredContacts(mockContacts);
    setLoading(false);
  }, []);

  // Filter contacts based on search query and favorites
  useEffect(() => {
    let filtered = contacts;
    
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery) ||
        (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (showFavorites) {
      filtered = filtered.filter(contact => contact.isFavorite);
    }
    
    setFilteredContacts(filtered);
  }, [searchQuery, showFavorites, contacts]);

  const toggleFavorite = (contactId: string) => {
    setContacts(prevContacts =>
      prevContacts.map(contact =>
        contact.id === contactId
          ? { ...contact, isFavorite: !contact.isFavorite }
          : contact
      )
    );
  };

  const openContactDetail = (contact: Contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleCall = (contact: Contact) => {
    Alert.alert(
      'Call Contact',
      `Call ${contact.name} at ${contact.phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling:', contact.phoneNumber) }
      ]
    );
  };

  const handleMessage = (contact: Contact) => {
    Alert.alert(
      'Message Contact',
      `Send message to ${contact.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Message', onPress: () => console.log('Messaging:', contact.phoneNumber) }
      ]
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity 
      style={styles.contactCard}
      onPress={() => openContactDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        {item.email && <Text style={styles.contactEmail}>{item.email}</Text>}
        {item.company && <Text style={styles.contactCompany}>{item.company}</Text>}
      </View>
      
      <View style={styles.contactActions}>
        <TouchableOpacity
          style={[styles.favoriteButton, item.isFavorite && styles.favoriteButtonActive]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {item.isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => handleCall(item)}
        >
          <Text style={styles.callButtonText}>📞</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => handleMessage(item)}
        >
          <Text style={styles.messageButtonText}>💬</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Loading contacts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerInfo}>
            <Text style={styles.title}>Contacts</Text>
            <Text style={styles.subtitle}>Manage your contacts</Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, !showFavorites && styles.filterTabActive]}
            onPress={() => setShowFavorites(false)}
          >
            <Text style={[styles.filterTabText, !showFavorites && styles.filterTabTextActive]}>
              All ({contacts.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterTab, showFavorites && styles.filterTabActive]}
            onPress={() => setShowFavorites(true)}
          >
            <Text style={[styles.filterTabText, showFavorites && styles.filterTabTextActive]}>
              Favorites ({contacts.filter(c => c.isFavorite).length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Contacts List */}
        {filteredContacts.length > 0 ? (
          <FlatList
            data={filteredContacts}
            renderItem={renderContact}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            style={styles.contactsList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Add your first contact to get started'
              }
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>📱</Text>
            <Text style={styles.quickActionText}>Import</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionText}>Groups</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Text style={styles.quickActionIcon}>⚙️</Text>
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Contact Detail Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowContactModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowContactModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedContact && (
              <View style={styles.contactDetails}>
                <Text style={styles.detailName}>{selectedContact.name}</Text>
                <Text style={styles.detailPhone}>{selectedContact.phoneNumber}</Text>
                {selectedContact.email && (
                  <Text style={styles.detailEmail}>{selectedContact.email}</Text>
                )}
                {selectedContact.company && (
                  <Text style={styles.detailCompany}>{selectedContact.company}</Text>
                )}
                {selectedContact.notes && (
                  <Text style={styles.detailNotes}>{selectedContact.notes}</Text>
                )}
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => handleCall(selectedContact)}
                  >
                    <Text style={styles.modalActionText}>📞 Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => handleMessage(selectedContact)}
                  >
                    <Text style={styles.modalActionText}>💬 Message</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.modalActionButton}
                    onPress={() => {
                      toggleFavorite(selectedContact.id);
                      setShowContactModal(false);
                    }}
                  >
                    <Text style={styles.modalActionText}>
                      {selectedContact.isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  addButton: {
    width: 43,
    height: 43,
    backgroundColor: '#0EA5E9',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 22,
    paddingBottom: 36,
  },
  searchContainer: {
    marginBottom: 22,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 14,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
    elevation: 2,
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#0EA5E9',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: 'white',
  },
  contactsList: {
    marginBottom: 24,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactInfo: {
    flex: 1,
    marginRight: 20,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  contactPhone: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 4,
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  favoriteButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  favoriteButtonText: {
    fontSize: 18,
    color: '#374151',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  callButtonText: {
    fontSize: 18,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  messageButtonText: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: '600',
  },
  contactDetails: {
    width: '100%',
    marginBottom: 24,
  },
  detailName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  detailPhone: {
    fontSize: 20,
    color: '#0EA5E9',
    marginBottom: 12,
    fontWeight: '600',
  },
  detailEmail: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 8,
  },
  detailCompany: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
  },
  detailNotes: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 12,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
  },
  modalActionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#0EA5E9',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});
