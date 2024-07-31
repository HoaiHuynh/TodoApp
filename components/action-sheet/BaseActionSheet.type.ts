export interface BaseActionSheetProps {
    onOpen?: () => void;
    onClose?: () => void;
}

export interface BaseActionSheetOptions {
    title?: string;
    items: BaseActionSheetItem[];
    message?: string;
    anchor?: number;
    tintColor?: string;
    cancelButtonTintColor?: string;
    userInterfaceStyle?: 'light' | 'dark';
}

export interface BaseActionSheetItem {
    title: string;
    buttonType?: 'default' | 'destructive' | 'cancel';
    disabled?: boolean;
    onPress?: () => void;
}

export interface BaseActionSheetRef {
    open: (option: BaseActionSheetOptions) => void;
}
