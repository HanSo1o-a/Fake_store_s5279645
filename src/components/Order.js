import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import { getRequest, postRequest, host } from '../utils/request.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from'react-redux';
import {  addToOrder, clearFromOrder } from '../models/rdstore.js';
import Toast from'react-native-toast-message';

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
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions
} from 'react-native/Libraries/NewAppScreen';

function Order({navigation}) {
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
                
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const safePadding = '5%';
    const dispatch = useDispatch();
    const data = useSelector(state => state.order.items);
    const orderList = [...data].reverse();
    const [itemVisibility, setItemVisibility] = useState({});
    const toggleItemVisibility = (id) => {
        setItemVisibility(prevVisibility => ({
          ...prevVisibility,
          [id]: !prevVisibility[id]
        }));
    };
    function renderItem({ item }) {
      const orderItemsArray = JSON.parse(item.order_items);
      return (
        <View style={styles.listItem}>
                
            {
                item.is_paid === 0 && item.is_delivered === 0? (
                    <Text style={{ color: '#000', textAlign: 'center', borderColor: 'black', borderWidth: 1, borderRadius: 6, padding: 10, backgroundColor: '#4DAFCC' }}>New Orders: {orderItemsArray.length}</Text>
                ) : (
                    item.is_paid === 1 && item.is_delivered === 0? (
                        <Text style={{ color: '#000', textAlign: 'center', borderColor: 'black', borderWidth: 1, borderRadius: 6, padding: 10, backgroundColor: '#4DAFCC' }}>Paid Orders: {orderItemsArray.length}</Text>
                    ) : (
                        item.is_paid === 1 && item.is_delivered === 1? (
                            <Text style={{ color: '#000', textAlign: 'center', borderColor: 'black', borderWidth: 1, borderRadius: 6, padding: 10, backgroundColor: '#4DAFCC' }}>Delivered Orders: {orderItemsArray.length}</Text>
                        ) : (
                            <Text>ERROR</Text>
                        )
                    )
                )
            }

            <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                        <Text style={{ flex: 1, textAlign: 'center' }}>Order ID:{item.id}</Text>
                        <Text style={{ flex: 1, textAlign: 'center' }}>Items:{item.item_numbers}</Text>
                        <Text style={{ flex: 1, textAlign: 'center' }}>Total:${item.total_price/100}</Text>
                    
                        <TouchableOpacity
                        onPress={() => {
                            toggleItemVisibility(item.id);
                        }} >
                        <Image
                            style={{ width: 15, height: 15 }}
                            source={    itemVisibility[item.id]
                                ? require('../../images/hide.png')
                                 : require('../../images/show.png') }
                        />
                    </TouchableOpacity>
                    </View>
                    <View style={{ backgroundColor: 'black', height: 1, marginTop: 10 }}></View>
                    <View style={{ display: itemVisibility[item.id] ? 'flex' : 'none' }}>

                    {orderItemsArray.map((orderItem, index) => (
                <View key={index}>
                    <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#DEDEDE', margin: 8, padding: 8, borderRadius: 5, borderColor: '#000000' }} onPress={() => navigation.navigate('ProductDetail', orderItem.prodID)}>
                        <Image
                            source={{ uri: orderItem.image }}
                            style={styles.goodsLogo}
                        />
                        <View style={{ flex: 1, height: '100%' }}>
                            <View style={{ width: 230, marginLeft: 10, flexDirection: 'column', height: 100 }}>
                                <Text style={{ color: '#2A6DC7', flex: 1 }}>{orderItem.title}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Text style={{ color: '#000000', fontWeight: 'bold' }}>Price: </Text>
                                    <Text style={{ color: '#000000' }}>${orderItem.price}</Text>
                                    <Text style={{ color: '#000000', fontWeight: 'bold', marginLeft: 5 }}>Quantity: </Text>
                                    <Text style={{ color: '#000000' }}>{orderItem.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
                        
                    
                        {
                item.is_paid === 0 && item.is_delivered === 0? (

<View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
                                <TouchableOpacity onPress={()=> payOrder(item.id)} style={{flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                    <Image
                                        style={{ width: 15, height: 15 }}
                                        source={    
                                            require('../../images/wallet.png')}
                                    />
                                    <Text style={{ color: 'white', marginLeft: 10}}>Pay</Text>
                                </TouchableOpacity>
                            </View>
                ) : (
                    item.is_paid === 1 && item.is_delivered === 0? (
<View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
                                <TouchableOpacity onPress={()=> receiveOrder(item.id)} style={{flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                    <Image
                                        style={{ width: 15, height: 15 }}
                                        source={    
                                            require('../../images/car.png')}
                                    />
                                    <Text style={{ color: 'white', marginLeft: 10}}>Receive</Text>
                                </TouchableOpacity>
                            </View>                    ) : (
                        item.is_paid === 1 && item.is_delivered === 1? (

<View></View>                        ) : (
                            <Text>ERROR</Text>
                        )
                    )
                )
            }
                    
                    
                    </View>
            



                        
         <Toast />
        </View>
    );
  }
  const payOrder = async (orderID) => {
        const response =await postRequest(host+'orders/updateorder',{
            "orderID": orderID,
            "isPaid": 1,
            "isDelivered": 0
            });
            console.log(response);
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                getOrders();
                dispatch(clearFromOrder());
                showSuccessToast(response.message);
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

  const receiveOrder = async (orderID) => {
    const response = await postRequest(host+'orders/updateorder',{
        "orderID": orderID,
        "isPaid": 1,
        "isDelivered": 1
        });
        if(response.status !== 'OK'){
            showFailToast(response.message);
        }else{
            getOrders();
            dispatch(clearFromOrder());
            showSuccessToast(response.message);
        }
}
    const fetchData = async () => {
      try {
          const response = await getRequest('https://fakestoreapi.com/products/categories');
          console.log(response);
        } catch (error) {
          console.error('GET error:', error);
      }
    };

    useFocusEffect(
        React.useCallback(() => {
            const initUser = async () => {
                const uid = await AsyncStorage.getItem('uid');
                if(!uid){
                    navigation.navigate('User')
                    return;
                }
            };
            initUser();
            return () => {
            };
        }, [])
    );
    useEffect(() => {
    }, [data]);

    return (
      <View style={{ display: 'flex', flexDirection:'column', height: '100%' }}>
        <StatusBar
            hidden
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
                My Orders
            </Text>
        </View>

        {data.length === 0?(
            <View style={styles.emptyCartContainer}>
                                <Text style={styles.emptyCartText}>your order is empty</Text>
                            </View>
        ):(
        
               <View style={{ height: '80%'}}>
                    <FlatList
                                        data={orderList}
                                        renderItem={renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
               </View>
             
        )}
        

      </View>
    );
}

const styles = StyleSheet.create({
    highlight: {
        fontWeight: '700',
    },
    listContainer: {
      marginLeft: 10,
      marginRight: 10,
      height: '70%'
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
        margin: 8,
        borderRadius: 5,
        borderColor: '#000000'
    },
    goodsLogo: {
        width: 100,
        height: 100,
        borderRadius: 8,
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

export default Order;
    