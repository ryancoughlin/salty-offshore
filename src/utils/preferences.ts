export const getUserPreference = (key: string): string | null => {
    return localStorage.getItem(key);
};

export const setUserPreference = (key: string, value: string): void => {
    localStorage.setItem(key, value);
};

export const removeUserPreference = (key: string): void => {
    localStorage.removeItem(key);
}; 