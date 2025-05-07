import React, { useState, useEffect } from'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getRequest, postRequest , host, putRequest} from '../utils/request.js';
import { useSelector, useDispatch } from'react-redux';
import { addToCart, delFromCart, addToOrder, clearFromCart, clearFromOrder } from '../models/rdstore.js';
import Toast from'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    FlatList,
    TextInput,
    Image,
    TouchableOpacity,
} from'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions
} from'react-native/Libraries/NewAppScreen';

function Cart({ navigation, route }) {
    const showFailToast = (msg) => {
                    Toast.show({
                        type: 'error', 
                        text1: 'error',
                        text2: msg,
                        position: 'bottom', 
                        visibilityTime: 3000, 
                        autoHide: true, 
                        topOffset: 30, 
                        bottomOffset: 10, 
                        onShow: () => {}, 
                        onHide: () => {} 
                    });
                };
        const showSuccessToast = (msg) => {
                    Toast.show({
                        type: 'success', 
                        text1: 'success',
                        text2: msg,
                        position: 'bottom', 
                        visibilityTime: 3000, 
                        autoHide: true, 
                        topOffset: 30, 
                        bottomOffset: 10, 
                        onShow: () => {}, 
                        onHide: () => {} 
                    });
                };
            

    const dispatch = useDispatch();
    const user = useSelector(state => state.user); 
    
    function transformData(data) {
        return {
            items: data.map(item => ({
                prodID: item.id,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                title: item.title,
                description: item.description
            }))
        };
    }
    
    function addOrder() {
        const orders = transformData(data);
        checkout(orders);
        setNeedUpd(true);
        dispatch(clearFromCart());
    }

    async function checkout(orders){
         try {
            const response = await postRequest(host+'orders/neworder',orders);
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                getOrders();
                dispatch(clearFromOrder());
                showSuccessToast(response.message);
            }
        } catch (error) {
        }
    }

    const getOrders = async () => {
            try {
                const response = await getRequest(host+'orders/all',);
                if(response.status !== 'OK'){
                    showFailToast(response.message);
                }else{
                    const items = response.orders;
                    if(items && items.length>0){
                        for (const key in items) {
                            dispatch(addToOrder(items[key]))
                        }
                    }
                    navigation.navigate('TabNavigator', {
                        screen: 'Order'
                    });
                }
            } catch (error) {
            }
        };

    function addCart(item) {
        setNeedUpd(true);
        dispatch(addToCart(item))
    }

    function delCart(item) {
        setNeedUpd(true);
        dispatch(delFromCart(item))
    }

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode? Colors.darker : Colors.lighter,
    };
    const safePadding = '5%';
    const [userId, setUserId] = useState('');
    const [needUpd, setNeedUpd] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    useFocusEffect(
        React.useCallback(() => {
            const initUser = async () => {
                const uid = await AsyncStorage.getItem('uid');
                console.log('uid',uid);
                setUserId(uid);
                if(!uid){
                    setIsLogin(true);
                    showFailToast('login is required');
                }else{
                    setIsLogin(false);
                }
            };
            initUser();
            return () => {
            };
        }, [])
    );

    const data = useSelector(state => state.cart.items);
    const totalQuantity = data.reduce((ac, item) => ac + item.quantity, 0);
    const totalPrice = data.reduce((ac, item) => ac + (item.price * item.quantity), 0);

    useEffect(() => {
        if(needUpd){
            setNeedUpd(false);
            putRequest(host+'cart',{'items':data});
        }
    }, [data]);
    function renderItem({ item }) {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ProductDetail', item.id)} >
                <Image
                    source={{ uri: item.image }}
                    style={styles.goodsLogo}
                />
                <View style={{ flex: 1, height: '100%' }}>
                    <View style={{ width: 230, marginLeft: 10, flexDirection: 'column', height: 100 }}>
                        <Text style={{ color: '#2A6DC7' }}>{item.title}</Text>
                        <View style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                            <Text style={{ color: '#000000', fontWeight: 'bold' }}>Price: </Text>
                            <Text style={{ color: '#000000' }}>${item.price}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Text onPress={() => { delCart(item) }} style={{ backgroundColor: '#34801D', borderRadius: 20, color: 'white', width: 20, textAlign: 'center' }}>-</Text>
                            <Text style={{ marginLeft: 10, marginRight: 10 }}>quantity: {item.quantity}</Text>
                            <Text onPress={() => { addCart(item) }} style={{ backgroundColor: '#34801D', borderRadius: 20, color: 'white', width: 20, textAlign: 'center' }}>+</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View>
{isLogin ? (<View style={{ display: 'flex',  alignItems: 'center'}}>
    <TouchableOpacity onPress={()=> {
        navigation.navigate('User')
    }} style={{marginTop: 300, flexDirection: 'row' , width: 200, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                    <Image
                                        style={{ width: 15, height: 15 }}
                                        source={    
                                            require('../../images/smile.png')}
                                    />
                                    <Text style={{ color: 'white', marginLeft: 10, fontSize: 25}}>Sign In</Text>
                                    </TouchableOpacity>
</View>): (<View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <StatusBar
                hidden
                barStyle={isDarkMode? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Shopping Cart
                </Text>
            </View>

            {data.length === 0? (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>your cart is empty</Text>
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <View style={{ width: '90%', height: 1, backgroundColor: 'black', marginLeft: '5%' }}></View>
                    <View style={{ justifyContent: 'center', backgroundColor: '#4DAFCC', display: 'flex', flexDirection: 'row', margin: 20, borderRadius: 6, padding: 10, borderColor: 'black', borderWidth: 2 }}>
                        <Text style={{ flex: 1 }}></Text>
                        <Text>Items: {totalQuantity}</Text>
                        <Text style={{ flex: 1 }}></Text>
                        <Text>Total Price: ${totalPrice}</Text>
                        <Text style={{ flex: 1 }}></Text>
                    </View>
                    <View style={styles.listContainer}>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    <View style={{ width: '90%', height: 1, backgroundColor: 'black', marginLeft: '5%' }}></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                        <TouchableOpacity onPress={()=>{addOrder()}} style={{ flexDirection: 'row', width: 150, alignItems: 'center', justifyContent: 'center', backgroundColor: '#2B6CCF', borderRadius: 6, borderWidth: 2, padding: 5, borderColor: '#000000' }}>
                            <Image
                                style={{ width: 15, height: 15 }}
                                source={
                                    require('../../images/wallet.png')
                                }
                            />
                            <Text style={{ color: 'white', marginLeft: 10 }}>Check Out</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </View>)}
        <Toast />
        </View>
    );
}

const styles = StyleSheet.create({
    highlight: {
        fontWeight: '700',
    },
    listContainer: {
        flex: 1,
        margin: 10,
        borderRadius: 6,
    },
    titleContainer: {
        paddingTop: 30,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#47A2D1',
        textAlign: 'center',
        padding: 10,
        borderColor: '#000000',
        borderRadius: 6,
        borderWidth: 2,
        margin: 10,
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#DEDEDE',
        margin: 8,
        padding: 8,
        borderRadius: 5,
        borderColor: '#000000'
    },
    addBtn: {
        color: '#5898FF',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
    },
    goodsLogo: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#000000',
    }
});

export default Cart;