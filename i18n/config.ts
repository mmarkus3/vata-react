import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './en/translation.json';
import translationFi from './fi/translation.json';

i18next.use(initReactI18next).init({
  lng: 'fi', // if you're using a language detector, do not define the lng option
  resources: {
    fi: {
      translation: translationFi,
    },
    en: {
      translation: translationEn,
    }
  },
});