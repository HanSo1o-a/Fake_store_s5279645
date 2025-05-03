import AsyncStorage from '@react-native-async-storage/async-storage';
const baseRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`error：${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('error:', error);
        throw error;
    }
};

export const getRequest = async (url) => {
    const token = await AsyncStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
        }
    };
    return baseRequest(url, options);
};

export const postRequest = async (url, body) => {
    const token = await AsyncStorage.getItem('token');
    console.log(url);
    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    const res = baseRequest(url, options);
    return res;
};

export const putRequest = async (url, body) => {
    const token = await AsyncStorage.getItem('token');
    console.log(token,url,body);
    const options = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    return baseRequest(url, options);
};

export const deleteRequest = async (url) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return baseRequest(url, options);
};  

export const host = 'http://192.168.0.7:3000/';