import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightColors, DarkColors, AppColors } from './colors';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeContextType = {
    colors: AppColors;
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
    colors: LightColors,
    mode: 'system',
    isDark: false,
    setMode: () => { },
});

const THEME_KEY = 'trackwise_theme_mode';

export function ThemeProvider({ children }: PropsWithChildren) {
    const systemScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('system');

    // Load saved theme on mount
    useEffect(() => {
        AsyncStorage.getItem(THEME_KEY).then(saved => {
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setModeState(saved);
            }
        });
    }, []);

    const setMode = async (newMode: ThemeMode) => {
        setModeState(newMode);
        await AsyncStorage.setItem(THEME_KEY, newMode);
    };

    const isDark =
        mode === 'dark' ? true :
            mode === 'light' ? false :
                systemScheme === 'dark';

    const colors = isDark ? DarkColors : LightColors;

    return (
        <ThemeContext.Provider value={{ colors, mode, isDark, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}