import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";

export function initI18n() {
  if (i18n.isInitialized) return i18n;

  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false,
  });

  return i18n;
}

