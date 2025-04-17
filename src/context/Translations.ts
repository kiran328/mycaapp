// translations.ts

import * as RNLocalize from 'react-native-localize';
import en from '../common/constants/en.json';
import mr from '../common/constants/mr.json';
import { MMKV } from 'react-native-mmkv';

const translations: any = {
  en,
  mr,
};

const storage = new MMKV();

const translate = (key: string) => {
  const storedLanguage = storage.getString('language');
  const locales = RNLocalize.getLocales();
  const preferredLocale = storedLanguage || locales[0]?.languageTag || 'en';

  const selectedTranslations = translations[preferredLocale] || translations['en'];

  return selectedTranslations[key] || key;
};

// Function to set the selected language
export const setLanguage = (language: string) => {
  storage.set('language', language);
};

export default translate;
