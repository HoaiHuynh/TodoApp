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

export const generateUUID = () => {
    // Define the possible characters for each digit
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // Initialize an empty string to store the UUID
    let uuid = '';
    // Loop through 5 times to generate each digit
    for (let i = 0; i < 5; i++) {
        // Pick a random index from 0 to 35
        let index = Math.floor(Math.random() * chars.length);
        // Append the character at that index to the UUID
        uuid += chars[index];
    }
    // Return the UUID
    return uuid;
};

export const getRemainTime = (remainingTime: number) => {
    if (remainingTime <= 0) {
        return '00:00:00';
    }

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    const hourString = hours < 10 ? `0${hours}` : hours;
    const minuteString = minutes < 10 ? `0${minutes}` : minutes;
    const secondString = seconds < 10 ? `0${seconds}` : seconds;

    return `${hourString}:${minuteString}:${secondString}`;
};