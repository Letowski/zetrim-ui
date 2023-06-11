const getFromStore = (name: string) => {
    return localStorage.getItem(name)
}

const getStringFromStore = (name: string): string => {
    return localStorage.getItem(name) ?? '';
}
const getBooleanFromStore = (name: string): boolean => {
    return (localStorage.getItem(name) ?? '') === 'true';
}

const setToStore = (name: string, value: string) => {
    return localStorage.setItem(name, value);
}

export {getFromStore, setToStore, getStringFromStore, getBooleanFromStore};
