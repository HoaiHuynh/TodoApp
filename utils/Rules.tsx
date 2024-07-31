import type { RegisterOptions } from 'react-hook-form';
import { typeOf } from './AppUtil';

interface IConfigField {
    keyId?: string;
    keyLabel?: string;
    keyValue?: string;
}

interface IConfig {
    config?: RegisterOptions;
    configField?: IConfigField;
    message?: string;
}

const useValid = () => {
    const isNotBlankString = (value: string, message?: string) => {
        if (!value || value === '' || value === null || value === undefined) {
            return message || 'Value is not blank!';
        }
        return undefined;
    };

    const isNotBlankBoolean = (value: boolean, message?: string) => {
        if (!value || value === undefined) {
            return message || 'Value is not blank!';
        }
        return undefined;
    };

    const isNotBlank = (validConfig?: IConfig): RegisterOptions => {
        const { config, message } = validConfig! || {};

        const defaultRules: RegisterOptions = {
            validate: (value: unknown) => {
                switch (typeOf(value)) {
                    case 'undefined':
                    case 'null':
                        return message || 'Value is not blank!';
                    case 'number':
                        return undefined;
                    case 'string':
                        return isNotBlankString(value as string, message);
                    case 'boolean':
                        return isNotBlankBoolean(value as boolean, message);
                    default:
                        return undefined;
                }
            }
        };
        //@ts-ignore
        return { ...defaultRules, ...config };
    };


    return {
        isNotBlank
    };
};

export default useValid;