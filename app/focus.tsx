import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { CountdownCircleTimer, TimeProps } from '@/components/count-down';
import DateTimePicker, { DateTimePickerRef } from '@/components/DateTimePicker';
import { getRemainTime } from '@/utils/AppUtil';
import TimePicker, { TimePickerRef, TimePickerValue } from '@/components/TimePicker';

const CountdownScreen = () => {

    const { bottom } = useSafeAreaInsets();
    const refDateTimePicker = useRef<DateTimePickerRef>(null);
    const refTimePicker = useRef<TimePickerRef>(null);
    const currentTime = useRef<number>(0);

    const opacity = useSharedValue(1);

    const [key, setKey] = useState<number>(0);
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState(false);
    const [sound, setSound] = useState<Audio.Sound>();

    useEffect(() => {
        return () => {
            sound?.unloadAsync();
        };
    }, [sound]);

    useEffect(() => {
        if (!isRunning && sound) {
            sound?.stopAsync();
        }
    }, [isRunning, sound]);

    const opacityStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value
        };
    });

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                opacity.value,
                [0, 1],
                ['#1E1E1E', '#FCFDFD']
            ),
        };
    });

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/alarm.mp3'));
            setSound(sound);

            await sound.playAsync();
            await sound.setIsLoopingAsync(true);
        } catch (error) {
            console.log('Error playing sound', error);
        }
    };

    const closeFocus = () => {
        router.back();
    };

    const handleSetTime = () => {
        Platform.OS === 'ios'
            ? refDateTimePicker.current?.show()
            : refTimePicker.current?.show();
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

    const onConfirmSelectTimePicker = (time: TimePickerValue) => {
        const selectedTime = time.hours * 3600 + time.minutes * 60 + time.seconds;
        currentTime.current = selectedTime;

        setTime(selectedTime);
        setKey(prev => prev + 1);
    };

    const handleStart = () => {
        opacity.value = withTiming(0, { duration: 500 });
        setIsRunning(true);
    };

    const handleStop = () => {
        opacity.value = withTiming(1, { duration: 500 });
        setIsRunning(false);
    };

    const handleReset = () => {
        setTime(currentTime.current);
        setKey(prev => prev + 1);

        setIsRunning(false);
    };

    const handleComplete = () => {
        playSound()
            .then(() => {
                Alert.alert('Time is up!', 'Your time is up!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setIsRunning(false);
                            opacity.value = withTiming(1, { duration: 500 });
                        }
                    }
                ]);
            });
    };

    const renderButton = () => {
        return (
            <View className='flex flex-row items-center justify-center gap-x-4'>
                {!isRunning && (
                    <TouchableOpacity
                        disabled={time < 1}
                        className='bg-emerald-400'
                        style={styles.button}
                        onPress={handleStart}>
                        <Text className='text-xl text-white font-semibold'>Start</Text>
                    </TouchableOpacity>
                )}
                {isRunning && (
                    <TouchableOpacity
                        disabled={time < 1}
                        className='bg-red-400'
                        style={styles.button}
                        onPress={handleStop}>
                        <Text className='text-xl text-white font-semibold'>Stop</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    disabled={time < 1}
                    className='border-2 border-purple-400'
                    style={styles.button}
                    onPress={handleReset}>
                    <Text className='text-xl text-purple-500 font-semibold'>Reset</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <Animated.View className='flex flex-1' style={backgroundStyle}>
            <SafeAreaView edges={['top', 'right', 'left']} style={styles.container}>
                <Animated.View style={opacityStyle}>
                    <View className="flex flex-row justify-between mx-2">
                        <TouchableOpacity
                            disabled={isRunning}
                            className="h-11 items-center justify-center rounded-full"
                            onPress={closeFocus}>
                            <Ionicons name='close' size={24} color='#333333' />
                        </TouchableOpacity>

                        <Text className="text-3xl font-semibold">Countdown Timer</Text>

                        <View className='h-10 w-10' />
                    </View>
                </Animated.View>

                <View className='flex flex-1 items-center justify-center'>
                    <CountdownCircleTimer
                        key={key}
                        isPlaying={isRunning}
                        duration={time}
                        initialRemainingTime={time}
                        size={225}
                        onComplete={handleComplete}
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

                    <TimePicker
                        ref={refTimePicker}
                        theme='light'
                        onChangeTime={onConfirmSelectTimePicker} />
                </View>

                <Animated.View style={opacityStyle}>
                    <View className='flex items-center justify-center' style={{ paddingBottom: bottom }}>
                        <TouchableOpacity
                            disabled={isRunning}
                            style={styles.button}
                            className='bg-blue-400'
                            onPress={handleSetTime}>
                            <Text className='text-xl text-white font-semibold'>Set Time</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <View className='h-5 w-full' />
            </SafeAreaView>
        </Animated.View>
    );
};

export default CountdownScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        height: 44,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 44,
    }
});