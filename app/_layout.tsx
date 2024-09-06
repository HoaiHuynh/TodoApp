import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SQLiteProvider } from 'expo-sqlite';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

import { useLoadAssets } from '@/hooks/useLoadAssets';
import migrateDbIfNeeded from '@/drizzle/MigrationScript';
import { Theme } from '@/themes/provider';

import '@/styles/global.css';

export default function RootLayout() {

    const { isLoaded } = useLoadAssets();

    if (!isLoaded) {
        return null;
    }

    return (
        <SQLiteProvider databaseName="todos.db" onInit={migrateDbIfNeeded} useSuspense>
            <GestureHandlerRootView>
                <Theme>
                    <BottomSheetModalProvider>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="+not-found" />
                            <Stack.Screen name="focus" options={{ presentation: 'fullScreenModal', headerShown: false }} />
                        </Stack>
                        <Toast topOffset={60} />
                    </BottomSheetModalProvider>
                </Theme>
            </GestureHandlerRootView>
        </SQLiteProvider>
    );
}