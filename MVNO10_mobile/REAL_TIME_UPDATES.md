# Real-time Updates in Mobile App

## Overview
The mobile app now supports real-time updates that automatically sync data changes from the web version without requiring app restart.

## Features

### 1. Automatic Data Refresh
- **Polling Interval**: Data refreshes every 30 seconds when user is logged in
- **App State Detection**: Immediate refresh when app becomes active from background
- **Smart Updates**: Only refreshes when user is authenticated

### 2. Updated Components
- **Dashboard**: Balance, connected numbers, and plan data update automatically
- **Dialpad**: User balance and connected numbers sync in real-time
- **Header**: Phone number and balance display current data

### 3. Visual Indicators
- **Refresh Button**: Shows loading state (⏳) during updates
- **Smooth Updates**: Data changes without page reload
- **Error Handling**: Graceful fallback on network errors

## Technical Implementation

### AuthContext Updates
```typescript
// Automatic refresh every 30 seconds
useAutoRefresh({
  enabled: !!user,
  interval: 30000,
  onRefresh: reloadProfile
});
```

### Component Integration
```typescript
// Components automatically update when user data changes
useEffect(() => {
  if (user) {
    fetchData();
  }
}, [user]);
```

### App State Monitoring
- Detects when app becomes active from background
- Triggers immediate data refresh
- Prevents unnecessary updates when app is inactive

## Benefits

1. **Seamless Experience**: Users see changes immediately
2. **Data Consistency**: Mobile and web stay in sync
3. **Battery Efficient**: Only updates when necessary
4. **User Friendly**: No manual refresh required

## Configuration

### Polling Interval
Default: 30 seconds
```typescript
useAutoRefresh({
  enabled: !!user,
  interval: 30000, // Change this value
  onRefresh: reloadProfile
});
```

### App State Sensitivity
The app refreshes data when:
- App becomes active from background
- User navigates between screens
- Manual refresh button is pressed

## Future Enhancements

1. **WebSocket Support**: Real-time push notifications
2. **Selective Updates**: Only update changed data
3. **Conflict Resolution**: Handle simultaneous edits
4. **Offline Support**: Queue updates when offline
