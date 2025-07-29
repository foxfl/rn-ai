import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationDe from './locales/de-DE/translations.json';
import translationEn from './locales/en-EN/translations.json';

const resources = {
  'de-DE': { translation: translationDe },
  'en-EN': { translation: translationEn },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('language');

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag ?? 'en-EN';
    await AsyncStorage.setItem('language', savedLanguage);
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: savedLanguage,
    fallbackLng: 'en-EN',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
