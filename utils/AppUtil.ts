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