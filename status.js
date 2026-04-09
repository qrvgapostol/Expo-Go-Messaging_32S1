// components/status.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default function StatusComponent() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => setIsConnected(state.isConnected));
    return () => unsubscribe();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isConnected ? '#4CAF50' : '#F44336' }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isConnected ? '#4CAF50' : '#F44336'}
      />
      <Text style={styles.text}>{isConnected ? 'Online' : 'Offline'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', padding: 10, alignItems: 'center' },
  text: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
