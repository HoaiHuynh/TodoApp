import React, { forwardRef, useImperativeHandle, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DateTimePickerProps {
    value?: Date;
    mode?: 'date' | 'time' | 'datetime';
    onChangeDate?: (date: Date) => void;
    onClose?: () => void;
}

export interface DateTimePickerRef {
    show: () => void;
    hide: () => void;
}

const DateTimePicker = forwardRef<DateTimePickerRef, DateTimePickerProps>((props, ref) => {
    const { value, mode = 'date', onChangeDate, onClose } = props;

    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => showDatePicker(),
        hide: () => hideDatePicker()
    }));

    const showDatePicker = () => {
        setVisible(true);
    };

    const hideDatePicker = () => {
        setVisible(false);
        onClose?.();
    };

    const handleConfirm = (date: Date) => {
        onChangeDate?.(date);
        
        hideDatePicker();
    };

    return (
        <DateTimePickerModal
            isVisible={visible}
            mode={mode}
            date={value}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker} />
    );
});

DateTimePicker.displayName = 'DateTimePicker';

export default DateTimePicker;