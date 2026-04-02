// import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { storageKeys } from '@/shared/config/storageKeys';
// import { createId } from '@/shared/lib/uuid';

// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// };

// type AuthResult = { success: boolean; error?: string };

// type AuthContextType = {
//   user: User | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<AuthResult>;
//   signup: (name: string, email: string, password: string) => Promise<AuthResult>;
//   logout: () => Promise<void>;
//   forgotPassword: (email: string) => Promise<AuthResult>;
//   resetPassword: (email: string, code: string, newPassword: string) => Promise<AuthResult>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// async function getUsers(): Promise<User[]> {
//   try {
//     const raw = await AsyncStorage.getItem(storageKeys.users);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// async function saveUsers(users: User[]): Promise<void> {
//   await AsyncStorage.setItem(storageKeys.users, JSON.stringify(users));
// }

// export function AuthProvider({ children }: PropsWithChildren) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     AsyncStorage.getItem(storageKeys.currentUser)
//       .then(raw => {
//         if (raw) {
//           try { setUser(JSON.parse(raw)); } catch {}
//         }
//       })
//       .finally(() => setIsLoading(false));
//   }, []);

//   const login = async (email: string, password: string): Promise<AuthResult> => {
//     const users = await getUsers();
//     const found = users.find(
//       u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password,
//     );
//     if (!found) return { success: false, error: 'Invalid email or password' };
//     await AsyncStorage.setItem(storageKeys.currentUser, JSON.stringify(found));
//     setUser(found);
//     return { success: true };
//   };

//   const signup = async (name: string, email: string, password: string): Promise<AuthResult> => {
//     const users = await getUsers();
//     if (users.find(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
//       return { success: false, error: 'An account with this email already exists' };
//     }
//     const newUser: User = {
//       id: createId(),
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       password,
//     };
//     await saveUsers([...users, newUser]);
//     await AsyncStorage.setItem(storageKeys.currentUser, JSON.stringify(newUser));
//     setUser(newUser);
//     return { success: true };
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem(storageKeys.currentUser);
//     setUser(null);
//   };

//   const forgotPassword = async (email: string): Promise<AuthResult> => {
//     const users = await getUsers();
//     const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
//     if (!found) return { success: false, error: 'No account found with this email' };
//     return { success: true };
//   };

//   const resetPassword = async (
//     email: string,
//     code: string,
//     newPassword: string,
//   ): Promise<AuthResult> => {
//     if (code.trim() !== '1234') return { success: false, error: 'Invalid reset code' };
//     const users = await getUsers();
//     const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase().trim());
//     if (idx === -1) return { success: false, error: 'Account not found' };
//     users[idx] = { ...users[idx], password: newPassword };
//     await saveUsers(users);
//     return { success: true };
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoading, login, signup, logout, forgotPassword, resetPassword }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }



import { createContext, useContext, PropsWithChildren } from 'react';
import { useUser, useClerk } from '@clerk/clerk-expo';

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const mappedUser: User | null = user
    ? {
        id: user.id,
        name: user.fullName ?? user.emailAddresses[0]?.emailAddress ?? '',
        email: user.emailAddresses[0]?.emailAddress ?? '',
      }
    : null;

  const logout = async () => {
    await signOut();
  };

  const updateProfile = async (firstName: string, lastName: string) => {
    await user?.update({ firstName, lastName });
  };

  return (
    <AuthContext.Provider value={{ user: mappedUser, isLoading: !isLoaded, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}