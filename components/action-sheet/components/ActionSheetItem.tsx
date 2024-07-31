import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ActionSheetItemProps {
    index: number;
    label: string;
    disabled?: boolean;
    isDestructive?: boolean;
    onPress?: () => void
}


const ActionSheetItem = (props: ActionSheetItemProps) => {
    const {
        label,
        disabled = false,
        isDestructive = false,
        onPress
    } = props;

    return (
        <TouchableOpacity
            style={style.item}
            disabled={disabled}
            onPress={onPress}>
            <View style={[style.label, { opacity: disabled ? 0.5 : 1 }]}>
                <Text style={[style.title, { color: isDestructive ? '#FF4D4F' : '#1890FF' }]}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ActionSheetItem;

const style = StyleSheet.create({
    item: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderTopWidth: 0.5,
        borderTopColor: '#BDBDBD'
    },
    label: {
        flex: 1,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomColor: '#BDBDBD'
    },
    title: {
        fontSize: 20,
        lineHeight: 25,
        color: '#1890FF'
    }
});