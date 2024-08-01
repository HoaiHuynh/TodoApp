import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { TimerPickerModal } from 'react-native-timer-picker';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface TimePickerProps {
    theme?: 'light' | 'dark';
    onChangeTime?: (time: TimePickerValue) => void;
    onClose?: () => void;
}

export interface TimePickerValue {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface TimePickerRef {
    show: () => void;
    hide: () => void;
}

const TimePicker = forwardRef<TimePickerRef, TimePickerProps>((props, ref) => {
    const {
        theme = 'light',
        onChangeTime,
        onClose
    } = props;

    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => showTimePicker(),
        hide: () => hideTimePicker()
    }));

    const showTimePicker = () => {
        setVisible(true);
    };

    const hideTimePicker = () => {
        setVisible(false);
        onClose?.();
    };

    const onConfirm = (pickedDuration: TimePickerValue) => {
        onChangeTime?.(pickedDuration);
        hideTimePicker();
    };

    return (
        <TimerPickerModal
            visible={visible}
            setIsVisible={hideTimePicker}
            onConfirm={onConfirm}
            modalTitle="Set Time"
            onCancel={hideTimePicker}
            closeOnOverlayPress
            Audio={Audio}
            Haptics={Haptics}
            styles={{ theme }}

            modalProps={{ overlayOpacity: 0.2 }}
        />
    );
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;