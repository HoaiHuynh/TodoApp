import React, { useRef } from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FloatButton from '@/components/FloatButton';
import CreateUpdateTodoModal, { CreateUpdateTodoModalRef } from '@/components/todo/CreateUpdateTodoModal';

export default function TabLayout() {
    const { bottom = 0 } = useSafeAreaInsets();
    const colorScheme = useColorScheme();

    const createUpdateTodoModalRef = useRef<CreateUpdateTodoModalRef>(null);

    const onAddTodo = () => {
        createUpdateTodoModalRef.current?.show();
    };

    return (
        <>
            <View className='flex flex-1'>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                    }}>
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Home',

                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                            ),
                        }} />
                    <Tabs.Screen
                        name="search"
                        options={{
                            title: 'Search',
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon name={focused ? 'search-circle' : 'search-circle-outline'} color={color} />
                            ),
                        }} />
                    <Tabs.Screen
                        name="browse"
                        options={{
                            title: 'Browse',
                            tabBarIcon: ({ color, focused }) => (
                                <TabBarIcon name={focused ? 'menu-sharp' : 'menu-outline'} color={color} />
                            ),
                        }} />
                </Tabs>
            </View>

            <View style={[styles.button, { bottom: 70 + bottom }]}>
                <FloatButton onPress={onAddTodo} />
            </View>

            <View className='absolute'>
                <CreateUpdateTodoModal ref={createUpdateTodoModalRef} />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 9999,
        height: 44,
        width: 44,
        borderRadius: 10,
        bottom: 70,
        right: 20
    }
});
