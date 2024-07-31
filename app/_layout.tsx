import { Stack } from 'expo-router';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider } from 'expo-sqlite';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { useLoadAssets } from '@/hooks/useLoadAssets';
import migrateDbIfNeeded from '@/drizzle/MigrationScript';

import '@/styles/global.css';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const { isLoaded } = useLoadAssets();

    if (!isLoaded) {
        return null;
    }

    return (
        <SQLiteProvider databaseName="todos.db" onInit={migrateDbIfNeeded} useSuspense>
            <GestureHandlerRootView>
                <ThemeProvider>
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