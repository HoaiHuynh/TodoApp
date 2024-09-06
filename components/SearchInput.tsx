import React, { useState } from 'react';
import { Pressable, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import useDebounce from '@/hooks/useDebounce';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/themes/context';
import { Colors } from '@/constants/Colors';

interface SearchInputProps {
    placeholder?: string,
    debounceTime?: number,
    onChangeText?: (value: string) => void,
    style?: StyleProp<ViewStyle>,
}

const SearchInput = (props: SearchInputProps) => {
    const {
        debounceTime = 350,
        placeholder = 'Search',
    } = props;

    const { theme } = useTheme();
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const onFocus = () => {
        setIsFocused(true);
    };

    const onBlur = () => {
        setIsFocused(false);
    };

    const onClear = () => {
        setValue('');
        props?.onChangeText?.('');
    };

    const onChangeTextDebounce = useDebounce((text: string) => {
        props?.onChangeText?.(text);
    }, debounceTime);

    const onChangeText = (text: string) => {
        onChangeTextDebounce(text);
        setValue(text);
    };

    const renderIcon = () => {
        if (!value || !isFocused) {
            return <Ionicons name='search' size={24} color={Colors[theme].icon} style={{ position: 'absolute', right: 16, top: 8 }} />;
        }

        return (
            <Pressable style={styles.iconWrapper} onPress={onClear}>
                <Ionicons name='close' size={24} color={Colors[theme].icon} style={{ position: 'absolute', right: 16, top: 8 }} />
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                className='text-input'
                style={[styles.input, props.style]} />
            {renderIcon()}
        </View>
    );
};

export default SearchInput;

const styles = StyleSheet.create({
    container: {
        height: 40,
        flexDirection: 'row',
    },
    input: {
        height: 40,
        width: '100%',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingVertical: 8,
        paddingLeft: 16,
        borderColor: '#D0D0D0'
    },
    iconWrapper: {
        position: 'absolute',
        right: 0,
        top: 0,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    }
});