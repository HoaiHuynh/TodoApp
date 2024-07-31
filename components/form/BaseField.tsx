import React, { useState } from 'react';
import { LayoutChangeEvent, LayoutRectangle, StyleSheet, Text, View } from 'react-native';
import { RegisterOptions, useController, UseControllerProps, useFormContext, useWatch } from 'react-hook-form';
import useValid from '@/utils/Rules';
import type { IModelField } from './BaseForm.type';
import type { IBaseFieldProps, IUseFormContext } from './BaseField.type';

/**
 * In this component:
 * - Gen label, wrap content, error
 * - Get value from form
 * - Override props
 * @param props 
 * @returns 
 */
const BaseField = (props: IBaseFieldProps) => {
    const {
        name,
        required,
        children,
        rules,
        styleField,
        styleError,
    } = props;

    const [layout, setLayout] = useState<LayoutRectangle>();
    const { control, model } = useFormContext() as IUseFormContext;
    const currentField = model?.fields?.[name] as IModelField;

    const { isNotBlank } = useValid();

    const controllerConfig: UseControllerProps = {
        control: control,
        name: name,
    };

    /**
     * define rules of field.
     */
    let currentRules: RegisterOptions = rules || {};
    if (required || currentField?.required) {
        //@ts-ignore
        currentRules = {
            ...isNotBlank(),
            ...currentRules
        };
    };

    if (currentRules) {
        controllerConfig.rules = currentRules;
    };

    const controller = useController(controllerConfig);
    const value = useWatch(controllerConfig);
    controller.field.value = value;


    const { field: { onChange, onBlur }, fieldState } = controller;

    const onLayout = (event: LayoutChangeEvent) => {
        if (event.nativeEvent.layout?.width !== layout?.width) {
            setLayout(event.nativeEvent.layout);
        }
    };

    const handleChange = (...event: any[]) => {
        onChange(...event);
        props?.onChange?.(...event);
    };

    /**
     * Render children like input, select, combobox, checkbox ....
     * Remove all base field before render children
     * @returns 
     */
    const renderContent = () => {
        const currentProps: any = { ...props };

        delete currentProps.children;
        delete currentProps.name;
        delete currentProps.required;
        delete currentProps.rules;
        delete currentProps.styleError;
        delete currentProps.styleField;
        delete currentProps.onChange;

        return children && children({
            isError: fieldState?.error?.message !== undefined,
            value,
            control,
            readOnly: currentField?.readOnly || currentProps?.readOnly || model?.readOnly,
            disabled: model?.disabled,
            ...currentField,
            ...currentProps,
            onChange: handleChange,
            onBlur
        });
    };

    const renderError = () => {
        if (!fieldState?.error?.message) {
            return <></>;
        }

        return (
            <Text style={[
                styles.errorMess,
                model?.styleError,
                currentField?.styleError,
                styleError,
                { width: layout?.width }
            ]}>
                {fieldState?.error?.message}
            </Text>
        );
    };

    const renderBody = () => {
        if (!layout) {
            return <></>;
        };

        return (
            <>
                {renderContent()}
                {renderError()}
            </>
        );
    };

    return (
        <View
            onLayout={onLayout}
            style={[
                styles.fieldWrapper,
                model?.styleField,
                currentField?.styleField,
                styleField
            ]}>
            {renderBody()}
        </View>
    );
};

export default BaseField;

const styles = StyleSheet.create({
    fieldWrapper: {
        overflow: 'scroll'
    },
    labelWrapper: {},
    label: {},
    required: {
        color: '#d50000',
        fontSize: 14,
    },
    content: {},
    errorMess: {
        fontSize: 12,
        color: '#d50000',
        paddingVertical: 3.5,
    }
});
