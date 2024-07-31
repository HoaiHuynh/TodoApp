import React from 'react';
import BaseField from './BaseField';
import type { IBaseFieldChildProps } from './BaseField.type';
import type { FieldViewProps } from './FieldView.type';
import { View } from 'react-native';

const FieldView = (props: FieldViewProps) => {
    const { children } = props;

    const renderChild = (childProps: IBaseFieldChildProps & any) => {
        return (
            <View>
                <>{children?.(childProps)}</>
            </View>
        );
    };

    return (
        <BaseField {...props}>
            {renderChild}
        </BaseField>
    );
};

export default FieldView;