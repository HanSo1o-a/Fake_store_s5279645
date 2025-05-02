import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = (key, value) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(key, value)
           .then(() => {
                resolve();
            })
           .catch((error) => {
                console.error('error:', error);
                reject(error);
            });
    });
};

export const getData = (key) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(key)
           .then((value) => {
                resolve(value);
            })
           .catch((error) => {
                console.error('error:', error);
                reject(error);
            });
    });
};

export const removeData = (key) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.removeItem(key)
           .then(() => {
                resolve();
            })
           .catch((error) => {
                console.error('error:', error);
                reject(error);
            });
    });
};
   