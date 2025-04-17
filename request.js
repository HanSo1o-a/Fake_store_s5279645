const baseRequest = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('网络请求出错:', error);
        throw error;
    }
};

export const getRequest = async (url) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return baseRequest(url, options);
};

export const postRequest = async (url, body) => {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    return baseRequest(url, options);
};

export const putRequest = async (url, body) => {
    const options = {
        method: 'PUT',
        headers: {
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