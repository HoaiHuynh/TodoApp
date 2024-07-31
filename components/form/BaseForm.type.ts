import type { ReactNode } from 'react';
import type {
    Control,
    FieldErrors, FieldValues, RegisterOptions,
    SetValueConfig, TriggerConfig, UseFormProps,
    UseFormRegisterReturn,
    WatchObserver
} from 'react-hook-form';

import type { IBaseFieldStyles, IFieldProps } from './BaseField.type';

export interface IModelField extends Omit<IFieldProps, 'name'>, IBaseFieldStyles { // extends IFieldProps without name
}

export type BaseFormField<T extends FieldValues = FieldValues> = {
    [k in keyof T]?: IModelField;
}

export interface IFormModel<T extends FieldValues = FieldValues> extends IBaseFieldStyles {
    fields: BaseFormField<T>;
    readOnly?: boolean;
    disabled?: boolean;
    [key: string]: any;
}

export interface BaseFormProps<TFieldValues extends FieldValues = FieldValues> extends UseFormProps<TFieldValues> {
    model?: IFormModel;
    onSubmit?: (values: any) => void;
    watchChange?: WatchObserver<TFieldValues>;
    children: ReactNode
}

export interface BaseFormAction {
    getValues: <TFieldValues extends FieldValues = FieldValues>() => TFieldValues;
    submit: <TFieldValues extends FieldValues = FieldValues> (onChange: (values: TFieldValues) => void) => void;
    getErrors: () => FieldErrors;
    setValue: (name: string, value: any, options?: SetValueConfig) => void;
    /**
     * Manually triggers form or input validation. This method is also useful when you have dependant validation (input validation depends on another input's value).
     * @param name 
     * @param options 
     * @returns 
     */
    trigger: (name?: string | string[] | readonly string[], options?: TriggerConfig) => Promise<boolean>;
    /**
     * Reset all values of form
     * @param valueDefault value default after reset form
     * @returns 
     */
    reset: <TFieldValues extends FieldValues = FieldValues>(valueDefault?: TFieldValues) => void;

    getDirtyStatus: () => boolean;
    /**
     * Register field
     * @returns onChange, onBlur, name, ref
     */
    register: (name: string, options: RegisterOptions) => UseFormRegisterReturn;
    /**
     * Get Form control
     */
    getControl: () => Control;
}

export interface BaseFormRef extends Omit<BaseFormAction, 'submit'> {
    submit: () => void;
}
