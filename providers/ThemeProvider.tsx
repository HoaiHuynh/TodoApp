import React, { createContext } from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { themes } from '../utils/ColorTheme';
import { ThemeType } from '@/types/type';

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeContext = createContext<{ theme: ThemeType }>({ theme: 'light' });

export const useTheme = () => React.useContext(ThemeContext);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const { colorScheme = 'light' } = useColorScheme();

    return (
        <ThemeContext.Provider value={{ theme: colorScheme }}>
            <View style={themes[colorScheme]} className="flex-1">
                <Text className='text-primary-default'>Theme provider</Text>
                {children}
            </View>
        </ThemeContext.Provider>
    );
};