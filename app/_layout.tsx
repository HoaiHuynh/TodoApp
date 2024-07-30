import { Stack } from 'expo-router';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SQLiteProvider } from 'expo-sqlite';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useLoadAssets } from '@/hooks/useLoadAssets';
import migrateDbIfNeeded from '@/drizzle/MigrationScript';

import "@/styles/global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const { isLoaded } = useLoadAssets();

    if (!isLoaded) {
        return null;
    }

    return (
        <SQLiteProvider databaseName="todos.db" onInit={migrateDbIfNeeded} useSuspense>
            <GestureHandlerRootView>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <BottomSheetModalProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </BottomSheetModalProvider>
                </ThemeProvider>
            </GestureHandlerRootView>
        </SQLiteProvider>
    );
}