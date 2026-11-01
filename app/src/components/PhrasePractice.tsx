import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { api } from '@/api/client';
import { davidDemoPhrases } from '@/api/davidPhrases';
import { MicButton } from '@/components/MicButton';
import { useRecorder } from '@/hooks/useRecorder';
import { colors, fonts, radius, spacing } from '@/theme';

/** English-only synthetic practice phrases. No real upload or scoring yet. */
export function PhrasePractice() {
  const [index, setIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [submission, setSubmission] = useState<string | null>(null);
  const { recording, toggle } = useRecorder();
  const phrase = davidDemoPhrases[index];

  const onMic = async () => {
    if (uploading) return;
    const uri = await toggle();
    if (!uri) return;
    setUploading(true);
    setSubmission(null);
    try {
      await api.submitPhraseRecording(phrase.id, uri);
      setSubmission('Mock submission complete. No server upload or pronunciation score yet.');
    } catch {
      Alert.alert('Could not submit recording', 'Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Phrase practice (demo)</Text>
      <Text style={styles.count}>Phrase {index + 1} of {davidDemoPhrases.length}</Text>
      <Text style={styles.phrase}>{phrase.text}</Text>
      <Text style={styles.note}>Tap the mic to start, then tap again to stop.</Text>
      <View style={styles.mic}>
        <MicButton recording={recording} onPress={onMic} disabled={uploading} />
      </View>
      {uploading && <Text style={styles.note}>Submitting mock recording…</Text>}
      {submission && <Text style={styles.note}>{submission}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Next practice phrase"
        disabled={recording || uploading}
        onPress={() => {
          setIndex((i) => (i + 1) % davidDemoPhrases.length);
          setSubmission(null);
        }}
        style={[styles.next, (recording || uploading) && { opacity: 0.5 }]}
      >
        <Text style={styles.nextText}>Next phrase</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.lg,
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: fonts.size.lg, fontWeight: fonts.weight.bold, color: colors.text },
  count: { fontSize: fonts.size.sm, color: colors.primary, fontWeight: fonts.weight.bold },
  phrase: { fontSize: fonts.size.lg, color: colors.text, fontWeight: fonts.weight.bold },
  note: { fontSize: fonts.size.sm, color: colors.textMuted },
  mic: { alignItems: 'center', paddingVertical: spacing.sm },
  next: { backgroundColor: colors.primary, padding: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  nextText: { color: '#FFFFFF', fontWeight: fonts.weight.bold },
});
