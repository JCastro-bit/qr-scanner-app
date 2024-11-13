// app/history.tsx
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useState } from 'react';

interface ScanHistoryItem {
  code: string;
  timestamp: Date;
  status: 'success' | 'error';
  message: string;
}

export default function HistoryScreen() {
  const [history] = useState<ScanHistoryItem[]>([]);

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No hay registros de escaneo</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.code}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.code}>{item.code}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.timestamp).toLocaleString()}
              </Text>
              <Text style={[
                styles.status,
                item.status === 'success' ? styles.successText : styles.errorText
              ]}>
                {item.status === 'success' ? 'Éxito' : 'Error'}
              </Text>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  status: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  successText: {
    color: '#4CAF50',
  },
  errorText: {
    color: '#F44336',
  },
  message: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
});