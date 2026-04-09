import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Status from './components/status';

export default function App() {
  return (
    <View style={styles.container}>
      <Status />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
