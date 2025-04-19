import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveData = async (value) => {
    try {
        await AsyncStorage.setItem('todoList', value);
    } catch (error) {
        console.error('error:', error);
    }
};

export const loadData = async () => {
    try {
        const value = await AsyncStorage.getItem('todoList');
        if(value!=null){
            return JSON.parse(value);
        }else{
            return [];
        }
    } catch (error) {
        console.error('error:', error);
    }
};
