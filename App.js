import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import Ionicons from'react-native-vector-icons/Ionicons';
import Categories from './src/components/Categories'
import CateGoods from './src/components/CateGoods'
import ProductDetail from './src/components/ProductDetail'
import Splash from './src/components/Splash'
import Cart from './src/components/Cart'
import Order from './src/components/Order'
import User from './src/components/User'
import { View, Text } from'react-native';
import { useSelector } from'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack=createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
    const cartItems = useSelector(state => state.cart.items);
    let cartCount = 0;
    if (cartItems && cartItems.length > 0) {
        cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    }
    const orderItems = useSelector(state => state.order.items);
    let orderCount = 0;
    if (orderItems && orderItems.length > 0) {
        orderCount = orderItems.length;
    }
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={'Splash'}>
                <Stack.Screen  name="TabNavigator"
                    options={{ headerShown: false }}>
                 {() => (
                        <Tab.Navigator screenOptions={({ route }) => ({
                            tabBarIcon: ({ focused, color, size }) => {
                                let iconName;
        
                                if (route.name === 'Categories') {
                                    iconName = focused ? 'cube' : 'cube-outline';
                                } else if (route.name === 'Cart') {
                                    iconName = focused ? 'cart' : 'cart-outline';
                                } else if (route.name === 'Order') {
                                    iconName = focused ? 'list' : 'list-outline';
                                } else if (route.name === 'User') {
                                    iconName = focused ? 'person' : 'person-outline';
                                }
        
                                const icon = <Ionicons name={iconName} size={size} color={color} />;
        
                                if (route.name === 'Cart' && cartCount > 0) {
                                    return (
                                        <View style={{ position: 'relative' }}>
                                            {icon}
                                            <View style={{
                                                position: 'absolute',
                                                top: -2,
                                                right: -2,
                                                backgroundColor: 'red',
                                                borderRadius: 8,
                                                width: 16,
                                                height: 16,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 10 }}>{cartCount}</Text>
                                            </View>
                                        </View>
                                    );
                                }else if (route.name === 'Order' && orderCount > 0) {
                                    return (
                                        <View style={{ position: 'relative' }}>
                                            {icon}
                                            <View style={{
                                                position: 'absolute',
                                                top: -2,
                                                right: -2,
                                                backgroundColor: 'red',
                                                borderRadius: 8,
                                                width: 16,
                                                height: 16,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Text style={{ color: 'white', fontSize: 10 }}>{orderCount}</Text>
                                            </View>
                                        </View>
                                    );
                                }
        
                                return icon;
                            },
                            tabBarActiveTintColor: '#3476F7',
                            tabBarInactiveTintColor: 'gray',
                        })}>
                        <Tab.Screen name="Categories" component={Categories}  options={{ headerShown: false }}/>
                        <Tab.Screen name="Cart" component={Cart}  options={{ headerShown: false }}/>
                        <Tab.Screen name="Order" component={Order}  options={{ headerShown: false }}/>
                        <Tab.Screen name="User" component={User}  options={{ headerShown: false }}/>
                    </Tab.Navigator>
                    )}
                </Stack.Screen>
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name="CateGoods" component={CateGoods} options={{ headerShown: false }} />
                <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;
    