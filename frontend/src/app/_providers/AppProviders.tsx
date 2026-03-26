import { PropsWithChildren, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import Toast from "react-native-toast-message";
import { PaperProvider } from "react-native-paper";

import { initI18n } from "@/shared/i18n/i18n";
import { theme } from "@/shared/theme/theme";

const queryClient = new QueryClient();
const i18n = initI18n();

export function AppProviders({ children }: PropsWithChildren) {
  // Ensure i18n is initialized once before any hooks render.
  useEffect(() => {}, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          {children}
          <Toast />
        </PaperProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

