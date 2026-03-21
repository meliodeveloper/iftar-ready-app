import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export async function sharePlace(name: string, address: string, type: 'mosque' | 'restaurant') {
  const emoji = type === 'mosque' ? '🕌' : '🍽️';
  const text = `${emoji} ${name}\n${address}`;

  if (Capacitor.isNativePlatform()) {
    await Share.share({
      title: name,
      text: text,
      dialogTitle: `Share ${type === 'mosque' ? 'mosque' : 'restaurant'}`,
    });
  } else {
    if (navigator.share) {
      await navigator.share({ title: name, text: text });
    }
  }
}
