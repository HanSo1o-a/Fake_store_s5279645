import { configureStore, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: []
    },
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item.id!== action.payload.id);
        },
        delFromCart: (state, action) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.items = state.items.filter(item => item.id!== action.payload.id);
                }
            }
        },
        clearFromCart: (state, action) => {
            state.items = [];
        },
    }
});

export const { addToCart, removeFromCart, delFromCart, clearFromCart } = cartSlice.actions;

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        items: []
    },
    reducers: {
        addToOrder: (state, action) => {
            state.items.push(action.payload);
        },
        removeFromOrder: (state, action) => {
            state.items = state.items.filter(item => item.id!== action.payload.id);
        },
        clearFromOrder: (state, action) => {
            state.items = [];
        }
    }
});

export const { addToOrder, removeFromOrder, clearFromOrder } = orderSlice.actions;

const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: '',
        name: '',
        uid: '',
        email: ''
    },
    reducers: {
        updateUser: (state, action) => {
            console.log(action.payload);
            state.token = action.payload.token;
            state.name = action.payload.name;
            state.uid = action.payload.uid;
            state.email = action.payload.email;
        }
    }
});

export const { updateUser } = userSlice.actions;
const rdstore = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        order: orderSlice.reducer,
        user: userSlice.reducer
    }
});

export default rdstore;    