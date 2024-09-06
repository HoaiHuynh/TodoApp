import { Appearance, View, ViewProps } from 'react-native';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { ThemesVariants, themes, themesVariables } from './theme';
import { SystemThemesVariants, ThemeContext, ThemesVariables } from './context';

type ThemeProps = ViewProps;

/**
 * Provides all the theme colors and variables for the app based on the themes inside the `./index.ts` file.
 */
const ThemeProvider = ({ children, className, ...props }: ThemeProps) => {
    const colorScheme = Appearance.getColorScheme();
    const userPreferredTheme = colorScheme === 'light' ? 'light' : 'dark';

    const [theme, setTheme] = useState<ThemesVariants | 'system'>('light');
    const [systemEnabled, setSystemEnabled] = useState<boolean>(true);
    const [systemTheme, setSystemTheme] = useState<SystemThemesVariants>(userPreferredTheme);
    const contextValue = useMemo(() => ({ theme, systemEnabled, systemTheme }), [theme, systemEnabled, systemTheme]);

    useEffect(useCallback(() => {
        (async () => {
            const storedTheme = await AsyncStorage.getItem('todo-app-theme');
            if (storedTheme !== null && storedTheme !== 'system') {
                setTheme(storedTheme as ThemesVariants);
                setSystemEnabled(false);
            } else {
                if (storedTheme === 'system' || storedTheme === null) {
                    try {
                        await AsyncStorage.setItem('todo-app-theme', 'system');
                        setTheme(userPreferredTheme);
                        setSystemEnabled(true);
                    } catch (e) {
                        console.error('Error:', e);
                    }
                } else {
                    setSystemEnabled(false);
                }
            }
        })();
    }, []), []);


    Appearance.addChangeListener((listener) => {
        (async () => {
            const storedTheme = await AsyncStorage.getItem('todo-app-theme');
            if (storedTheme !== null && storedTheme !== 'system') return;

            if (systemEnabled && storedTheme === 'system') {
                setTheme(listener.colorScheme === 'light' ? 'light' : 'dark');
            }
        })();
    });

    /**
     * Use this function to get the color for a certain variable and use it as a string.
     *
     * @param cssVariable Pass the CSS variable that you want to get the color from.
     * @returns A string with the color using hsl like this: `hsl(`*`n`* *`n`* *`n`*`%)`
     */
    const getThemeColorByVariable = useCallback((colorKey: ThemesVariables) => {
        return theme === 'system'
            ? `hsl(${themesVariables[systemTheme][`--${colorKey}`]})`
            : `hsl(${themesVariables[theme][`--${colorKey}`]})`;
    }, [theme]);

    /**
     * Use this function to get the color for a certain variable and use it as a string.
     *
     * @param cssVariable Pass the CSS variable that you want to get the color from.
     * @param alpha The opacity of the color from 0 to 1 (0 = 0% and 1 = 100%).
     * @returns A string with the color using hsl like this: `hsla(`*`n`* *`n`* *`n`*`% *`a`*)`
     */
    const getThemeColorByVariableAndAlpha = useCallback((colorKey: ThemesVariables, alpha: number) => {
        return theme === 'system'
            ? `hsla(${themesVariables[systemTheme][`--${colorKey}`].replaceAll(
                ' ',
                ', '
            )}, ${alpha})`
            : `hsla(${themesVariables[theme][`--${colorKey}`].replaceAll(
                ' ',
                ', '
            )}, ${alpha})`;
    }, [theme]);

    const handleThemeSwitch = useCallback(async (newTheme: ThemesVariants | 'system') => {
        if (newTheme === 'system') {
            setSystemEnabled(true);
            setTheme(Appearance.getColorScheme() === 'light' ? 'light' : 'dark');
            setSystemTheme(Appearance.getColorScheme() === 'light' ? 'light' : 'dark');

            await AsyncStorage.setItem('todo-app-theme', 'system');
        } else {
            setSystemEnabled(false);
            setTheme(newTheme);

            await AsyncStorage.setItem('todo-app-theme', newTheme);
        }
    }, [setSystemEnabled, setTheme, setSystemTheme]);

    if (!theme) {
        return <></>;
    }

    return (
        //@ts-ignore
        <View style={themes[theme]} className="flex-1" {...props}>
            <StatusBar
                style={theme === 'light' ? 'dark' : 'light'}
                backgroundColor={getThemeColorByVariable('background')} />
            <ThemeContext.Provider
                value={{
                    systemEnabled: contextValue.systemEnabled,
                    systemTheme: contextValue.systemTheme,
                    theme: (contextValue.theme || 'light') as ThemesVariants,
                    getThemeColorByVariable,
                    getThemeColorByVariableAndAlpha,
                    handleThemeSwitch,
                }}>
                {children}
            </ThemeContext.Provider>
        </View>
    );
};

export const Theme = memo(ThemeProvider);