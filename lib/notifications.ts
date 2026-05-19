import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function ensurePermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (existing !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('vion', {
      name: 'VION',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#7C5CFC',
    });
  }
  return status === 'granted';
}

export async function agendarLembreteSemanal() {
  const ok = await ensurePermissions();
  if (!ok) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'VION · Mapeamento semanal',
      body: 'Uma nova semana, uma nova leitura. Reflecte por 5 minutos.',
    },
    trigger: {
      weekday: 2, // segunda-feira (1=domingo, 2=segunda)
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}
