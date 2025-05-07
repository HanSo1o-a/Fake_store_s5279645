import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import { getRequest, postRequest , host, putRequest } from '../utils/request.js';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../models/rdstore.js';
import Toast from 'react-native-toast-message';
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
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions
} from 'react-native/Libraries/NewAppScreen';

function ProductDetail({navigation, route}) {
    const showToast = () => {
        Toast.show({
            type: 'success', 
            text1: 'success',
            text2: 'Add To Cart',
            position: 'bottom', 
            visibilityTime: 3000, 
            autoHide: true, 
            topOffset: 30, 
            bottomOffset: 10, 
            onShow: () => {}, 
            onHide: () => {} 
        });
    };
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
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart.items);
    async function AddToCart(item){
        const uid = await AsyncStorage.getItem('uid');
        console.log('uid',uid);
        if(!uid){
            showFailToast('login is required');
            setTimeout(() => {
                navigation.navigate('TabNavigator', {
                    screen: 'User'
                });
            }, 2000);
            return;
        }
        item.uid = uid;
        item.rating = "";
        dispatch(addToCart(item));
        const newCartItems = [...cartItems, item];
        const response = putRequest(host+'cart',{'items':newCartItems});
        showToast();
    }
    const id = route.params;
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const [data, setData] = useState([]);
    const fetchData = async (id) => {
        try {
            const response = await getRequest('https://fakestoreapi.com/products/'+id);
            setData(response);
          } catch (error) {
            console.error('GET error:', error);
        }
      };

    useEffect(() => {
        fetchData(id);
    }, []);
    return (
      <View style={{ display: 'flex', flexDirection:'column', height: '100%' }}>
        <StatusBar
            hidden
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
                Product Details
            </Text>
        </View>

<ScrollView showsVerticalScrollIndicator={false}
            bounces={false}
            alwaysBounceVertical={false} style={{  marginBottom : 60}}>
        {data && Object.keys(data).length>0 &&  <View>


<View>
    <View style={{ display:'flex', flexDirection:'row', justifyContent: 'center' }}>
        <Image
            style={{ width: '93%' , height: 350 , borderRadius: 6}}
            source={{ uri: data.image }} 
        />
    </View>
    <Text style={{fontWeight:'bold', marginLeft: 12, marginRight: 12, marginTop: 5}}>{data.title}</Text>

<View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10, backgroundColor:'#4CAFCC', marginLeft: 12, marginRight: 12, borderRadius:6, paddingTop: 8, paddingBottom: 8, borderColor: 'black', borderWidth:2}}>
    <View onPress={()=> navigation.goBack()} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center'}}>
        <Text style={{fontWeight:'bold'}}>Rate:</Text>
        <Text>{data.rating.rate}</Text>
    </View>
    <View onPress={()=> navigation.goBack()} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center' }}>
        <Text style={{fontWeight:'bold'}}>Count:</Text>
        <Text>{data.rating.count}</Text>
    </View>
    <View onPress={()=> navigation.goBack()} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center'}}>
        <Text style={{fontWeight:'bold'}}>Price:</Text>
        <Text>{data.price}</Text>
    </View>
</View>

    <View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
    <TouchableOpacity onPress={()=> navigation.goBack()} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
    <Image
        style={{ width: 15, height: 15 }}
        source={    
            require('../../images/backspace.png')}
    />
    <Text style={{ color: 'white', marginLeft: 10}}>Back</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=> AddToCart(data)} style={{marginLeft: 20, flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
    <Image
        style={{ width: 15, height: 15 }}
        source={    
            require('../../images/backspace.png')}
    />
    <Text style={{ color: 'white', marginLeft: 10}}>Add To Cart</Text>
    </TouchableOpacity>
</View>

    <Text style={{ marginLeft: 12, marginTop: 10, fontWeight: 'bold'}}>Description</Text>

    <Text style={{ backgroundColor:'#DEDEDE', borderColor: 'black', borderWidth: 1, margin: 12, padding: 10, borderRadius: 6 }}>{data.description}</Text>
</View>

</View>
}
        
       
</ScrollView>


        

        
    </View>
    );
}

const styles = StyleSheet.create({
    highlight: {
        fontWeight: '700',
    },
    listContainer: {
      margin: 10,
      borderRadius: 6,
      borderColor: '#000000',
      borderWidth: 2,
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
    }
});

export default ProductDetail;
    