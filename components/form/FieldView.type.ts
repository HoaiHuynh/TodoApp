import type { FC, ReactElement, ReactNode } from 'react';
import type { IBaseFieldChildProps, IBaseFieldStyles, IFieldProps } from './BaseField.type';

export interface FieldViewChildProps extends IBaseFieldChildProps {

}

export interface FieldViewProps extends IFieldProps, IBaseFieldStyles {
    /**
     * Children content
     * @param props 
     * @returns 
     */
    children: (props: FieldViewChildProps & any) => ReactNode | ReactElement | FC;
}