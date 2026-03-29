// import { PropsWithChildren } from 'react';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { I18nextProvider } from 'react-i18next';
// import Toast from 'react-native-toast-message';

// import { initI18n } from '@/shared/i18n/i18n';
// import { AuthProvider } from '@/shared/lib/auth';

// const queryClient = new QueryClient();
// const i18n = initI18n();

// export function AppProviders({ children }: PropsWithChildren) {
//   return (
//     <I18nextProvider i18n={i18n}>
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
//           {children}
//           <Toast />
//         </AuthProvider>
//       </QueryClientProvider>
//     </I18nextProvider>
//   );
// }




import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider } from '@clerk/clerk-expo';
import { initI18n } from '@/shared/i18n/i18n';
import { AuthProvider } from '@/shared/lib/auth';

const queryClient = new QueryClient();
const i18n = initI18n();

const tokenCache = {
  async getToken(key: string) {
    return SecureStore.getItemAsync(key);
  },
  async saveToken(key: string, value: string) {
    return SecureStore.setItemAsync(key, value);
  },
};

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            {children}
            <Toast />
          </AuthProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ClerkProvider>
  );
}