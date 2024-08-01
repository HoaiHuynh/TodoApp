import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CountdownCircleTimer, TimeProps } from '@/components/count-down';
import DateTimePicker, { DateTimePickerRef } from '@/components/DateTimePicker';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getRemainTime } from '@/utils/AppUtil';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CountdownScreen = () => {

    const { bottom } = useSafeAreaInsets();
    const refDateTimePicker = useRef<DateTimePickerRef>(null);
    const currentTime = useRef<number>(0);

    const [key, setKey] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);

    const closeFocus = () => {
        router.back();
    };

    const handleSetTime = () => {
        refDateTimePicker.current?.show();
    };

    const onConfirmSelectTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const selectedTime = hours * 3600 + minutes * 60 + seconds;
        currentTime.current = selectedTime;

        setTime(selectedTime);
        setKey(prev => prev + 1);
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setTime(currentTime.current);
        setKey(prev => prev + 1);

        setIsRunning(false);
    };

    const renderButton = () => {
        return (
            <View className='flex flex-row items-center justify-center gap-x-4'>
                {!isRunning && (
                    <TouchableOpacity className='bg-emerald-400' style={styles.button} onPress={handleStart}>
                        <Text className='text-xl text-white font-semibold'>Start</Text>
                    </TouchableOpacity>
                )}
                {isRunning && (
                    <TouchableOpacity className='bg-red-400' style={styles.button} onPress={handleStop}>
                        <Text className='text-xl text-white font-semibold'>Stop</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity className='border-2 border-purple-400' style={styles.button} onPress={handleReset}>
                    <Text className='text-xl text-purple-500 font-semibold'>Reset</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View className='flex flex-1'>
            <SafeAreaView edges={['top', 'right', 'left']} style={{ flex: 1 }}>
                <View className="flex flex-row justify-between mx-2">
                    <TouchableOpacity
                        className="h-11 items-center justify-center rounded-full"
                        onPress={closeFocus}>
                        <Ionicons name='close' size={24} color='#333333' />
                    </TouchableOpacity>

                    <Text className="text-3xl font-semibold">Countdown Timer</Text>

                    <View className='h-10 w-10' />
                </View>

                <View className='flex flex-1 items-center justify-center'>
                    <CountdownCircleTimer
                        key={key}
                        isPlaying={isRunning}
                        duration={time}
                        initialRemainingTime={time}
                        size={225}
                        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                        colorsTime={[7, 5, 2, 0]}>
                        {({ remainingTime, color }: TimeProps) => (
                            <Text
                                accessibilityRole="timer"
                                accessibilityLiveRegion="assertive"
                                importantForAccessibility="yes"
                                className='text-5xl'
                                style={{ color }}>
                                {getRemainTime(remainingTime)}
                            </Text>
                        )}
                    </CountdownCircleTimer>

                    <View className='mt-8'>
                        {renderButton()}
                    </View>

                    <DateTimePicker
                        value={new Date(new Date().setHours(0, 0, 0, 0))}
                        mode='time'
                        ref={refDateTimePicker}
                        onChangeDate={onConfirmSelectTime} />
                </View>

                <View className='flex items-center justify-center' style={{ paddingBottom: bottom }}>
                    <TouchableOpacity style={styles.button} className='bg-blue-400' onPress={handleSetTime}>
                        <Text className='text-xl text-white font-semibold'>Set Time</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default CountdownScreen;

const styles = StyleSheet.create({
    button: {
        height: 44,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 44,
    }
});