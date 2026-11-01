import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockQa, QA_ENDPOINTS, type QaEndpoint } from '@/api/mockQa';

/** Developer-only floating panel. Never rendered in production builds. */
export function MockQaPanel() {
  const [open, setOpen] = useState(false);
  const [armed, setArmed] = useState<QaEndpoint | null>(mockQa.getArmed());
  const [slow, setSlow] = useState(mockQa.getSlow());
  if (!__DEV__) return null;

  const arm = (endpoint: QaEndpoint) => {
    mockQa.arm(endpoint);
    setArmed(endpoint);
    setOpen(false);
  };
  return (
    <View style={styles.anchor} pointerEvents="box-none">
      {open && (
        <View style={styles.panel}>
          <Text style={styles.heading}>Mock API QA (dev only)</Text>
          <Text style={styles.note}>Arm one failure, then navigate or trigger the matching request. Retry succeeds automatically.</Text>
          <ScrollView style={styles.list}>
            {QA_ENDPOINTS.map((endpoint) => (
              <Pressable key={endpoint} accessibilityRole="button" style={styles.option} onPress={() => arm(endpoint)}>
                <Text style={styles.optionText}>Fail next: {endpoint}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable accessibilityRole="button" style={styles.option} onPress={() => { mockQa.setSlow(!slow); setSlow(!slow); }}>
            <Text style={styles.optionText}>Slow requests (2.5s): {slow ? 'ON' : 'OFF'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.option} onPress={() => { mockQa.disarm(); setArmed(null); }}>
            <Text style={styles.optionText}>Clear armed failure</Text>
          </Pressable>
          <Text style={styles.note}>Armed: {mockQa.getArmed() ?? 'none'} (panel refreshes when opened)</Text>
        </View>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle mock API QA controls"
        style={styles.fab}
        onPress={() => { setArmed(mockQa.getArmed()); setOpen(!open); }}
      >
        <Text style={styles.fabText}>{open ? 'Close QA' : armed ? 'QA armed' : 'QA'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', top: 56, right: 8, alignItems: 'flex-end', zIndex: 1000 },
  fab: { backgroundColor: '#26354B', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 },
  fabText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  panel: { width: 275, maxHeight: 460, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: '#CCCCCC' },
  heading: { fontSize: 16, fontWeight: '700', color: '#17212E' },
  note: { fontSize: 12, color: '#48576A', marginVertical: 7 },
  list: { maxHeight: 250 },
  option: { padding: 10, backgroundColor: '#EAF0F8', borderRadius: 8, marginTop: 5 },
  optionText: { color: '#17212E', fontSize: 13 },
});
