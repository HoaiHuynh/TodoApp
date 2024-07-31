export const getId = (id: unknown) => {
    if (id === undefined || id === null) {
        return '';
    }

    if (typeof id === 'string') {
        return id;
    }

    if (typeof id === 'number') {
        return id.toString();
    }
};

type ITypeOf = 'undefined' | 'null' | 'number' | 'object' | 'array' | 'string' | 'function' | 'regexp' | 'date' | 'error' | 'promise' | 'generatorfunction' | 'weakmap' | 'map' | 'asyncfunction';
type ITypeOfResponse = ITypeOf | Omit<string, ITypeOf> | undefined;

/**
 * Get type of value
 * @param variable 
 * @returns one of 'undefined' | 'null' | 'number' | 'object' | 'array' | 'string' | 'function' | 'regexp' | 'date' | 'error' | 'promise' | 'generatorfunction' | 'weakmap' | 'map' | 'asyncfunction'
 */
export const typeOf = <T,>(variable: T): ITypeOfResponse => {
    return {}?.toString?.call?.(variable)?.split(' ')[1]?.slice(0, -1).toLowerCase();
};

export const resetFormData = (values: Record<string, any>, valueDefault?: Record<string, any>) => {
    const currentValues: Record<string, any> = {};
    Object.keys(values).forEach((key) => {
        if (values?.[key] !== undefined) {
            if (Array?.isArray(values?.[key])) {
                currentValues[key] = valueDefault?.[key] || [];
            } else if (typeof values?.[key] === 'boolean') {
                currentValues[key] = typeof valueDefault?.[key] === 'boolean' ? valueDefault?.[key] : null;
            } else {
                currentValues[key] = valueDefault?.[key] || null;
            }
        }
    });
    return currentValues;
};