import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

interface FloatButtonProps {
    onPress: () => void;
}

const FloatButton = (props: FloatButtonProps) => {
    const scale = useSharedValue(1);

    const onPress = () => {
        props?.onPress?.();
    };

    const onPressIn = () => {
        scale.value = withTiming(0.8, { duration: 100 });
    };

    const onPressOut = () => {
        scale.value = withSequence(
            withSpring(1.2),
            withSpring(1)
        );
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={[styles.container, animatedStyle]} className='bg-blue-500'>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.button}
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}>
                <Ionicons name='add' type='Ion' color={'#FFFFFF'} size={24} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export default FloatButton;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 44,
        width: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    button: {
        height: 44,
        width: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});