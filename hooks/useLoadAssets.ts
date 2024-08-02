import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import useCalendar from './useCalendar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export function useLoadAssets() {
    // const sqliteDB = openDatabaseSync('todos.db');
    const { requestPermission } = useCalendar();

    const [hasLoadedFonts, loadingFontsError] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // useDrizzleStudio(sqliteDB);

    useEffect(() => {
        requestPermission();
    }, []);

    useEffect(() => {
        if (loadingFontsError) throw loadingFontsError;
    }, [loadingFontsError]);

    useEffect(() => {
        if (hasLoadedFonts) {
            SplashScreen.hideAsync();
        };
    }, [hasLoadedFonts]);

    return { isLoaded: hasLoadedFonts };
}