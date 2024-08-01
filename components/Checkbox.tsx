import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ColorValue } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface CheckboxProps {
    value?: boolean;
    color?: ColorValue;
    type?: 'checkbox' | 'radio';
    onChange?: (value: boolean) => void;
}

const Checkbox = (props: CheckboxProps) => {
    const {
        value,
        color,
        type = 'radio',
        onChange,
    } = props;
    const [checked, setChecked] = useState(!!value);
    const scale = useSharedValue(0);

    useEffect(() => {
        setChecked(!!value);

        scale.value = withTiming(value ? 1 : 0, {
            duration: 250,
            easing: Easing.ease,
        });

    }, [value]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePress = () => {
        setChecked(!checked);
        scale.value = withTiming(checked ? 0 : 1, {
            duration: 250,
            easing: Easing.ease,
        });

        onChange?.(!checked);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.checkboxContainer}>
            <View style={type === 'checkbox' ? styles.box : styles.radio}>
                <Animated.View style={[type === 'checkbox' ? styles.innerBox : styles.innerRadio, { backgroundColor: color || '#3b82f6' }, animatedStyle]} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radio: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: '#DEDEDE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    innerRadio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#3b82f6',
    },
    box: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#DEDEDE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    innerBox: {
        width: 18,
        height: 18,
        borderRadius: 5,
        backgroundColor: '#3b82f6',
    },
    label: {
        fontSize: 16,
    },
});

export default Checkbox;