import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StickButtonProps extends Omit<TouchableOpacityProps, 'children'> {
    label: string;
    icon?: string;

    labelStyle?: StyleProp<TextStyle>;
    iconColor?: string;
}

const StickButton = (props: StickButtonProps) => {
    const {
        label,
        icon,
        onPress,
        iconColor = '#000',
        style,
        ...rest
    } = props;
    return (
        <TouchableOpacity {...rest} onPress={onPress} style={[styles.button, style]}>
            {props.icon && <Ionicons name={icon as any} size={20} color={iconColor} />}
            <Text>{label}</Text>
        </TouchableOpacity>
    );
};

export default StickButton;

const styles = StyleSheet.create({
    button: {
        height: 35,
        minWidth: 80,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 0.5,
        paddingHorizontal: 6,
        columnGap: 8,
        borderColor: '#E5E7EB',
    }
});