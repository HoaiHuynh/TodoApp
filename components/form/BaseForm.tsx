import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
    useForm, FormProvider, SetValueConfig, TriggerConfig,
    FieldValues, useFormState, RegisterOptions, UseFormRegisterReturn,
    Control,
} from 'react-hook-form';
import { resetFormData } from '@/utils/AppUtil';
import type { BaseFormProps, BaseFormRef } from './BaseForm.type';

const BaseForm = forwardRef<BaseFormRef, BaseFormProps>((props, ref) => {
    const formConfig = { ...props };
    delete formConfig.model;
    delete formConfig.onSubmit;
    delete formConfig.children;

    const methods = useForm({ mode: 'all', ...formConfig });

    const { errors, isDirty } = useFormState({ control: methods?.control });

    // Callback version of watch.  It's your responsibility to unsubscribe when done.
    useEffect(() => {
        const subscription = methods?.watch((value, { name, type }) =>
            props?.watchChange?.(value, { name, type })
        );

        return () => subscription.unsubscribe();
    }, [methods?.watch]);

    useImperativeHandle(ref, () => ({
        submit: methods?.handleSubmit(onSubmit),
        setValue: setValue,
        getValues: getValues,
        getErrors: getErrors,
        trigger: trigger,
        reset: reset,
        getDirtyStatus: getDirtyStatus,
        register: register,
        getControl: getControl
    }));

    const setValue = (name: string, value: any, options?: SetValueConfig) => {
        methods?.setValue(name, value, options);
    };

    const getValues = <TFieldValues extends FieldValues = FieldValues>(): TFieldValues => {
        return methods?.getValues() as TFieldValues;
    };

    const getErrors = () => {
        return errors;
    };

    const getDirtyStatus = () => {
        return isDirty;
    };

    const trigger = async (name?: string | string[] | readonly string[], options?: TriggerConfig): Promise<boolean> => {
        return await methods?.trigger(name, options);
    };

    const onSubmit = <TFieldValues extends FieldValues = FieldValues>(values: TFieldValues) => {
        props.onSubmit && props.onSubmit(values);
    };

    const reset = <TFieldValues extends FieldValues = FieldValues>(valueDefault?: TFieldValues) => {
        const values = methods?.getValues() || {};
        const resetValue = resetFormData(values, valueDefault);

        methods?.reset(resetValue);
    };

    const register = (name: string, options: RegisterOptions): UseFormRegisterReturn => {
        return methods?.register(name, options);
    };

    const getControl = (): Control => {
        return methods?.control;
    };

    return (
        <FormProvider {...{ ...methods, model: props?.model }}>
            {props?.children}
        </FormProvider>
    );
});

BaseForm.displayName = 'BaseForm';
export default BaseForm;