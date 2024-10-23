import React from 'react';
import BaseField from './BaseField';
import type { IBaseFieldChildProps } from './BaseField.type';
import type { FieldViewProps } from './FieldView.type';

const FieldView = (props: FieldViewProps) => {
    const { children } = props;

    const renderChild = (childProps: IBaseFieldChildProps) => {
        return (
            <>{children?.(childProps)}</>
        );
    };

    return (
        <BaseField {...props}>
            {renderChild}
        </BaseField>
    );
};

export default FieldView;