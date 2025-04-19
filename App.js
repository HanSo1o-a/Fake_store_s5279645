import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import Categories from './src/components/Categories'
import CateGoods from './src/components/CateGoods'
import ProductDetail from './src/components/ProductDetail'

const Stack=createNativeStackNavigator();
function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Categories">
                <Stack.Screen name="Categories" component={Categories} options={{ headerShown: false }} />
                <Stack.Screen name="CateGoods" component={CateGoods} options={{ headerShown: false }} />
                <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;
    