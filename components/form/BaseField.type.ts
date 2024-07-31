import type { ReactNode } from 'react';
import type { Control, RegisterOptions, UseFormReturn } from 'react-hook-form';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { IFormModel } from './BaseForm.type';

export interface IBaseFieldStyles {
    styleField?: StyleProp<ViewStyle>;
    styleError?: StyleProp<TextStyle>;
}

export interface IBaseFieldChildProps {
    isError: boolean;
    onChange: (value: string) => void;
    onBlur: () => void;
    value: any;
    readOnly?: boolean;
    disabled?: boolean;
    control: Control;
}

export type IFieldDefaultProps = {
    name: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    rules?: RegisterOptions;
}

export type IFieldProps = IFieldDefaultProps;

export interface IBaseFieldProps extends IFieldDefaultProps, IBaseFieldStyles {
    children: ((props: IBaseFieldChildProps) => ReactNode);
    onChange?: (...event: any[]) => void;
}

export interface IUseFormContext extends UseFormReturn {
    model: IFormModel;
}
