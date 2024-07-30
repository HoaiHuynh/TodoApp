import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface CheckboxProps {
    value?: boolean;
    onChange?: (value: boolean) => void;
}

const Checkbox = (props: CheckboxProps) => {
    const [checked, setChecked] = useState(!!props?.value);
    const scale = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePress = () => {
        setChecked(!checked);
        scale.value = withTiming(checked ? 0 : 1, {
            duration: 300,
            easing: Easing.bounce,
        });

        props?.onChange?.(!checked);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.checkboxContainer}>
            <View style={styles.box}>
                <Animated.View style={[styles.innerBox, animatedStyle]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    box: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#DEDEDE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    innerBox: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#000000',
    },
    label: {
        fontSize: 16,
    },
});

export default Checkbox;