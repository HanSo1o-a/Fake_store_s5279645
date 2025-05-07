import React, { useState, useEffect, use } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getRequest, postRequest, host } from '../utils/request.js';
import { saveData, getData, removeData } from '../models/model.js';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from'react-redux';
import { addToOrder, removeFromOrder, updateUser, clearFromCart, clearFromOrder, addToCart } from '../models/rdstore.js';

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
    Button,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions
} from 'react-native/Libraries/NewAppScreen';
import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue';

function User({ navigation }) {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const safePadding = '5%';
    const [data, setData] = useState([]);
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [isUpdate, setIsUpdate] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user); 

    function addOrder(item) {
        dispatch(addToOrder(item))
    }

    function addCart(item) {
        dispatch(addToCart(item))
    }

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
        

    const signUpUser = async (name, email, password) => {
        try {
            const response = await postRequest(host+'users/signup',{
                name:name, email: email, password: password
            });
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                dispatch(updateUser({
                    token: response.token,
                    name: response.name,
                    email: response.email,
                    uid: response.id+''
                }));
                saveData('uid',response.id+'')
                saveData('username',response.name);
                saveData('email',response.email);
                saveData('token',response.token);
                setToken(response.token);
                setUsername(response.name);
                setEmail(response.email);
                setUid(response.id+'');
                setIsLogin(true);
            }
        } catch (error) {
        }
    };

    const logout = async () => {
        try {
            dispatch(clearFromOrder());
            dispatch(clearFromCart());
            dispatch(updateUser({
                token: '',
                name: '',
                email: '',
                uid: ''
            }));
            saveData('uid','')
            saveData('username','');
            saveData('email','');
            saveData('token','');
            setToken('');
            setUsername('');
            setEmail('');
            setUid('');
            setPassword('');
        } catch (error) {
        }
    };

    const updUser = async (name, password) => {
        try {
            const response = await postRequest(host+'users/update',{
                name: name, password: password
            });
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                setData('username',response.name);
                setUsername(response.name);
                showSuccessToast(response.message);
                setIsUpdate(false);
            }
        } catch (error) {
        }
    };

    const signInUser = async (email, password) => {
        try {
            const response = await postRequest(host+'users/signin',{
                email: email, password: password
            });
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                dispatch(updateUser({
                    token: response.token,
                    name: response.name,
                    email: response.email,
                    uid: response.id+''
                }));
                saveData('uid',response.id+'')
                saveData('username',response.name);
                saveData('email',response.email);
                saveData('token',response.token);
                setToken(response.token);
                setUsername(response.name);
                setEmail(response.email);
                setUid(response.id+'');
                getOrders();
                getCarts();
            }
        } catch (error) {
        }
    };
    const getOrders = async () => {
        try {
            const response = await getRequest(host+'orders/all',);
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                const items = response.orders;
                if(items && items.length>0){
                    for (const key in items) {
                        addOrder(items[key])
                    }
                }
            }
        } catch (error) {
        }
    };
    const getCarts = async () => {
        try {
            const response = await getRequest(host+'cart');
            if(response.status !== 'OK'){
                showFailToast(response.message);
            }else{
                const items = response.items;
                if(items && items.length>0){
                    for (const key in items) {
                        console.log(items[key]);
                        addCart(items[key]);
                    }
                }
            }
        } catch (error) {
        }
    };
    useFocusEffect(
        React.useCallback(() => {
            setToken(user.token);
            setEmail(user.email);
            setUsername(user.name);
            setUid(user.uid);
            if(!user.uid){
                console.log("xxx");
                dispatch(clearFromOrder());
                dispatch(clearFromCart());
                dispatch(updateUser({
                    token: '',
                    name: '',
                    email: '',
                    uid: ''
                }));
                saveData('uid','')
                saveData('username','');
                saveData('email','');
                saveData('token','');
                setToken('');
                setUsername('');
                setEmail('');
                setUid('');
                setPassword('');
            }
            return () => { };
        }, [user])
    );
    useEffect(() => {
        
    }, []);
    function login(){
        if (email === '') {
            showFailToast('please input email');
            return;
        }
        if (password === '') {
            showFailToast('please input password');
            return;
        }
        signInUser(email, password);
    }

    function register(){
        if (username === '') {
            showFailToast('please input username');
            return;
        }
        if (email === '') {
            showFailToast('please input email');
            return;
        }
        if (password === '') {
            showFailToast('please input password');
            return;
        }
        signUpUser(username, email, password);
    }

    function editUser(){
        if (username === '') {
            showFailToast('please input username');
            return;
        }
        if (password === '') {
            showFailToast('please input password');
            return;
        }
        updUser(username, password);
    }
    return (
        <ScrollView style={{ flex: 1 }}>
            {token ? (
                <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <StatusBar
                        hidden
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                        backgroundColor={backgroundStyle.backgroundColor}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>
                            User Profile
                        </Text>
                    </View>
                    <View>
                        

                        {
                    
                    isUpdate? (
                    

<View>
<View style={{ backgroundColor: '#4949A1', margin: 20, borderRadius: 6, padding: 10 }}>


<Text style={{ color: 'white', marginTop: 10 }}>New User Name</Text>
<TextInput
    style={styles.input}
    value={username}
    placeholder="Enter your user name"
    onChangeText={(text) => setUsername(text)}
/>
<Text style={{ color: 'white' }}>New Password</Text>
<TextInput
    style={styles.input}
    placeholder="Enter your password"
    value={password}
    onChangeText={(text) => setPassword(text)}
    secureTextEntry={true}
/>

</View>
<View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
                        <TouchableOpacity onPress={()=> editUser()} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                        <Image
                            style={{ width: 15, height: 15 }}
                            source={    
                                require('../../images/right.png')}
                        />
                        <Text style={{ color: 'white', marginLeft: 10}}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> setIsUpdate(false)} style={{marginLeft: 20, flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                            <Image
                                style={{ width: 15, height: 15 }}
                                source={    
                                    require('../../images/wrong.png')}
                            />
                            <Text style={{ color: 'white', marginLeft: 10}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
</View>
                        



                    
                
                
                ):(
                <View>
                    <Text style={{ marginLeft: 20}}>User Name: {username}</Text>
                    <Text style={{ marginLeft: 20}}>Email: {email}</Text>
                    <View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
                                <TouchableOpacity onPress={()=> setIsUpdate(true)} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                <Image
                                    style={{ width: 15, height: 15 }}
                                    source={    
                                        require('../../images/edit.png')}
                                />
                                <Text style={{ color: 'white', marginLeft: 10}}>Update</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> logout()} style={{marginLeft: 20, flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                    <Image
                                        style={{ width: 15, height: 15 }}
                                        source={    
                                            require('../../images/logout.png')}
                                    />
                                    <Text style={{ color: 'white', marginLeft: 10}}>Sign Out</Text>
                                </TouchableOpacity>
                            </View>
                </View>
                )
                    }
                    </View>
                </View>
            ) : (
                isLogin ? (
                    <View>
                        <View style={{ backgroundColor: '#4949A1', margin: 20, borderRadius: 6, marginTop: 200, padding: 10 }}>

                            <Text style={{ color: 'white' }}>Sign in with email and password</Text>
                            <Text style={{ color: 'white', marginTop: 20  }}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                placeholder="Enter your email"
                                onChangeText={(text) => setEmail(text)}
                            />
                            <Text style={{ color: 'white' }}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                            />
                            <View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
                                <TouchableOpacity onPress={()=> {
                                    setPassword('');
                                    setEmail('');
                                }} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                <Image
                                    style={{ width: 15, height: 15 }}
                                    source={    
                                        require('../../images/clear.png')}
                                />
                                <Text style={{ color: 'white', marginLeft: 10}}>Clear</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> login()} style={{marginLeft: 20, flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                <Image
                                    style={{ width: 15, height: 15 }}
                                    source={    
                                        require('../../images/smile.png')}
                                />
                                <Text style={{ color: 'white', marginLeft: 10}}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                            <Text onPress={()=>{
                                setIsLogin(false)
                            }} style={{ textAlign: 'center', marginTop: 10, color: '#aaaaaa'}}>Switch to: sign up a new user</Text>
                        </View>
                        
                    </View>
                ) : (
                    <View>
                        <View style={{ backgroundColor: '#4949A1', margin: 20, borderRadius: 6, marginTop: 200, padding: 10 }}>

                            <Text style={{ color: 'white' }}>Sign up a new user</Text>

                            <Text style={{ color: 'white', marginTop: 20 }}>User Name</Text>
                            <TextInput
                                style={styles.input}
                                value={username}
                                placeholder="Enter your user name"
                                onChangeText={(text) => setUsername(text)}
                            />
                            <Text style={{ color: 'white' }}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={email}
                                placeholder="Enter your email"
                                onChangeText={(text) => setEmail(text)}
                            />
                            <Text style={{ color: 'white' }}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                secureTextEntry={true}
                            />


                            <View  style={{ flexDirection: 'row' , justifyContent: 'center', marginTop: 10}}>
                                <TouchableOpacity onPress={()=> register()} style={{ flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                <Image
                                    style={{ width: 15, height: 15 }}
                                    source={    
                                        require('../../images/right.png')}
                                />
                                <Text style={{ color: 'white', marginLeft: 10}}>Confirm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> setIsLogin(true)} style={{marginLeft: 20, flexDirection: 'row' , width: 120, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
                                    <Image
                                        style={{ width: 15, height: 15 }}
                                        source={    
                                            require('../../images/wrong.png')}
                                    />
                                    <Text style={{ color: 'white', marginLeft: 10}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )
            )}
        </ScrollView>
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
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#D1D2E7'
    }
});

export default User;