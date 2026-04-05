// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// import { Colors } from '@/shared/theme/colors';

// function CustomTabBar({ state, navigation }: BottomTabBarProps) {
//   const labels: Record<string, string> = {
//     index: 'Dashboard',
//     work: 'Add',
//     history: 'History',
//   };
//   const icons: Record<string, { active: string; inactive: string }> = {
//     index: { active: 'grid', inactive: 'grid-outline' },
//     work: { active: 'add', inactive: 'add' },
//     history: { active: 'time', inactive: 'time-outline' },
//   };

//   return (
//     <View style={styles.container}>
//       {state.routes.map((route, index) => {
//         const isFocused = state.index === index;
// const isAdd = route.name === 'work';
// const isProfile = route.name === 'profile';   // yeh new add ki
//         const iconDef = icons[route.name] ?? { active: 'apps', inactive: 'apps-outline' };

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });
//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         if (isAdd) {
//           return (
//             <TouchableOpacity
//               key={route.key}
//               onPress={onPress}
//               style={styles.addWrap}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={[Colors.gradientStart, Colors.gradientEnd]}
//                 style={styles.addBtn}
//               >
//                 <Ionicons name="add" size={30} color="white" />
//               </LinearGradient>
//               <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive }]}>
//                 {labels[route.name] ?? route.name}
//               </Text>
//             </TouchableOpacity>
//           );
//         }

//         if (isProfile) {
//   return (
//     <TouchableOpacity
//       key={route.key}
//       onPress={onPress}
//       style={styles.tab}
//       activeOpacity={0.7}
//     >
//       <Ionicons
//         name={isFocused ? 'person' : 'person-outline'}
//         size={24}
//         color={isFocused ? Colors.tabActive : Colors.tabInactive}
//       />
//       <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive }]}>
//         Profile
//       </Text>
//     </TouchableOpacity>
//   );
// }

//         return (
//           <TouchableOpacity
//             key={route.key}
//             onPress={onPress}
//             style={styles.tab}
//             activeOpacity={0.7}
//           >
//             <Ionicons
//               name={(isFocused ? iconDef.active : iconDef.inactive) as any}
//               size={24}
//               color={isFocused ? Colors.tabActive : Colors.tabInactive}
//             />
//             <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive }]}>
//               {labels[route.name] ?? route.name}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

// export default function TabsLayout() {
//   return (
//     <Tabs
//       tabBar={props => <CustomTabBar {...props} />}
//       screenOptions={{ headerShown: false }}
//     >
//       <Tabs.Screen name="index" />
//       <Tabs.Screen name="work" />
//       <Tabs.Screen name="history" />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     backgroundColor: Colors.card,
//     paddingBottom: Platform.OS === 'web' ? 10 : 24,
//     paddingTop: 8,
//     paddingHorizontal: 8,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 10,
//     alignItems: 'center',
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 4,
//     gap: 3,
//   },
//   addWrap: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 3,
//   },
//   addBtn: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: -22,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   label: {
//     fontSize: 11,
//     fontWeight: '600',
//     letterSpacing: 0.2,
//   },
// });



// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import { Tabs } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

// import { Colors } from '@/shared/theme/colors';

// function CustomTabBar({ state, navigation }: BottomTabBarProps) {
//   const labels: Record<string, string> = {
//     index: 'Dashboard',
//     history: 'History',
//     work: 'Add',
//     documents: 'Docs',
//     profile: 'Profile',
//     appointments: 'Calendar',
//   };

//   const icons: Record<string, { active: string; inactive: string }> = {
//     index: { active: 'grid', inactive: 'grid-outline' },
//     work: { active: 'add', inactive: 'add' },
//     history: { active: 'time', inactive: 'time-outline' },
//     documents: { active: 'document-text', inactive: 'document-text-outline' },
//     profile: { active: 'person', inactive: 'person-outline' },
//     appointments: { active: 'calendar', inactive: 'calendar-outline' },
//   };

//   return (
//     <View style={styles.container}>
//       {state.routes.map((route, index) => {
//         const isFocused = state.index === index;
//         const isAdd = route.name === 'work';
//         const isProfile = route.name === 'profile';
//         const iconDef = icons[route.name] ?? { active: 'apps', inactive: 'apps-outline' };

//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });
//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         if (isAdd) {
//           return (
//             <TouchableOpacity
//               key={route.key}
//               onPress={onPress}
//               style={styles.addWrap}
//               activeOpacity={0.85}
//             >
//               <LinearGradient
//                 colors={[Colors.gradientStart, Colors.gradientEnd]}
//                 style={styles.addBtn}
//               >
//                 <Ionicons name="add" size={30} color="white" />
//               </LinearGradient>
//               <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive }]}>
//                 {labels[route.name] ?? route.name}
//               </Text>
//             </TouchableOpacity>
//           );
//         }

//         if (isProfile) {
//           return (
//             <TouchableOpacity
//               key={route.key}
//               onPress={onPress}
//               style={styles.tab}
//               activeOpacity={0.7}
//             >
//               <Ionicons
//                 name={isFocused ? 'person' : 'person-outline'}
//                 size={24}
//                 color={isFocused ? Colors.tabActive : Colors.tabInactive}
//               />
//               <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive }]}>
//                 Profile
//               </Text>
//             </TouchableOpacity>
//           );
//         }

//         return (
//           <TouchableOpacity
//             key={route.key}
//             onPress={onPress}
//             style={styles.tab}
//             activeOpacity={0.7}
//           >
//             <Ionicons
//               name={(isFocused ? iconDef.active : iconDef.inactive) as any}
//               size={24}
//               color={isFocused ? Colors.tabActive : Colors.tabInactive}
//             />
//             <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive }]}>
//               {labels[route.name] ?? route.name}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }

// export default function TabsLayout() {
//   return (
//     <Tabs
//       tabBar={props => <CustomTabBar {...props} />}
//       screenOptions={{ headerShown: false }}
//     >
//       <Tabs.Screen name="index" />
//       <Tabs.Screen name="documents" />
//       <Tabs.Screen name="work" />
//       <Tabs.Screen name="history" />
//       <Tabs.Screen name="profile" />
//       <Tabs.Screen name="appointments" />    
//       </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     backgroundColor: Colors.card,
//     paddingBottom: Platform.OS === 'web' ? 10 : 24,
//     paddingTop: 8,
//     paddingHorizontal: 8,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 10,
//     alignItems: 'center',
//   },
//   tab: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 4,
//     gap: 3,
//   },
//   addWrap: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 3,
//   },
//   addBtn: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: -22,
//     shadowColor: Colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   label: {
//     fontSize: 11,
//     fontWeight: '600',
//     letterSpacing: 0.2,
//   },
// });





import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/shared/theme/ThemeContext';

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colors: Colors } = useTheme();

  const labels: Record<string, string> = {
    index: 'Dashboard',
    work: 'Add',
    history: 'History',
    profile: 'Profile',
  };

  const icons: Record<string, { active: string; inactive: string }> = {
    index: { active: 'grid', inactive: 'grid-outline' },
    work: { active: 'add', inactive: 'add' },
    history: { active: 'time', inactive: 'time-outline' },
    profile: { active: 'person', inactive: 'person-outline' },
  };

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: Colors.card,
      paddingBottom: Platform.OS === 'web' ? 10 : 24,
      paddingTop: 8,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 10,
      alignItems: 'center',
    }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconDef = icons[route.name] ?? { active: 'apps', inactive: 'apps-outline' };

        if (route.name === 'documents' || route.name === 'appointments') return null;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab} activeOpacity={0.7}>
            {isFocused ? (
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                style={styles.activeCircle}
              >
                <Ionicons
                  name={iconDef.active as any}
                  size={26}
                  color="white"
                />
              </LinearGradient>
            ) : (
              <Ionicons
                name={iconDef.inactive as any}
                size={22}
                color={Colors.tabInactive}
              />
            )}
            <Text style={[styles.label, { color: isFocused ? Colors.tabActive : Colors.tabInactive, fontSize: isFocused ? 13 : 11 }]}>
              {labels[route.name] ?? route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="work" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="documents" options={{ href: null }} />
      <Tabs.Screen name="appointments" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 4,
  },
  activeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});