import { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [name, setName] = useState('TrackWise User');
  const [status, setStatus] = useState('Student');
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const sessionRaw = await AsyncStorage?.getItem('trackwise_session');
      if (!sessionRaw) {
        return router.replace({ pathname: '/login' } as any);
      }
      const user = JSON.parse(sessionRaw);
      setName(user.fullName || 'TrackWise User');
      setStatus(user.status || 'Student');
    };
    loadProfile();
  }, [router]);

  const signOut = async () => {
    await AsyncStorage?.removeItem('trackwise_session');
    router.replace({ pathname: '/login' } as any);
  };

  const comment = `Your secured document tracker and time job tracker for student / asylum / chancerkarte needs.`;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome, {name} 👋</Text>
      <Text style={styles.subHeading}>Status: {status}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>TrackWise at a glance</Text>
        <Text style={styles.cardText}>{comment}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>

      <Modal visible={sheetOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quick access</Text>
            <TouchableOpacity style={styles.modalItem} onPress={() => { setSheetOpen(false); router.push({ pathname: '/(tabs)/explore' } as any); }}>
              <Text style={styles.modalItemText}>Go to Explore</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { setSheetOpen(false); router.push({ pathname: '/login' } as any); }}>
              <Text style={styles.modalItemText}>Login / Switch User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem} onPress={() => { setSheetOpen(false); router.push({ pathname: '/signup' } as any); }}>
              <Text style={styles.modalItemText}>Add New Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalClose} onPress={() => setSheetOpen(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab} onPress={() => setSheetOpen(true)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eaf8ff', padding: 20 },
  heading: { fontSize: 30, fontWeight: '900', color: '#075985' },
  subHeading: { marginTop: 8, fontSize: 14, color: '#0369a1' },
  card: { marginTop: 16, borderRadius: 18, borderWidth: 1, borderColor: '#bae6fd', backgroundColor: '#fff', padding: 14, boxShadow: '0px 6px 16px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#075985' },
  cardText: { marginTop: 8, color: '#475569' },
  logoutButton: { marginTop: 16, borderRadius: 10, backgroundColor: '#f43f5e', paddingVertical: 10, alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#fff', padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  modalItem: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 11 },
  modalItemText: { color: '#334155' },
  modalClose: { marginTop: 12, alignItems: 'center' },
  modalCloseText: { color: '#dc2626', fontWeight: '700' },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#0ea5e9', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
});

