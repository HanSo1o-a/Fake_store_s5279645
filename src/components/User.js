import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import { getRequest, postRequest } from '../utils/request.js';
import { saveData, getData } from '../models/model.js';
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

function User({navigation}) {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const safePadding = '5%';
    const [data, setData] = useState([]);
    const [uid, setUid] = useState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 调用 getData 函数
    getData('uid')
    .then((value) => {
        setUid(value);
    })
    .catch((error) => {
    });
    const fetchData = async () => {
      try {
          const response = await getRequest('https://fakestoreapi.com/products/categories');
          console.log(response);
          setData(response);
        } catch (error) {
      }
    };

    const signNewUser = async () => {
        try {
            const response = await postRequest('https://fakestoreapi.com/users');
            console.log(response);
            setData(response);
          } catch (error) {
        }
      };
      useEffect(() => {
        fetchData();
    }, []);

    return (
        
      <ScrollView  
      style={{ flex: 1 }}>
        {uid ? (
<View style={{ display: 'flex', flexDirection:'column', height: '100%' }}>
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
                <View >
                    <Text >用户详情页面，uid: {uid}</Text>
                </View>
                   </View>
            ) : (
                <View> 
                    <View style={{backgroundColor:'#4949A1', margin: 20, borderRadius: 6, marginTop: 200, padding: 10}}>

                        <Text style={{ color: 'white'}}>Sign up a new user</Text>

                        <Text style={{ color: 'white', marginTop: 20}}>User Name</Text>
                        <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
                        <Text style={{ color: 'white'}}>Email</Text>
                        <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
                        <Text style={{ color: 'white'}}>Password</Text>
                        <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
            />
                    </View>
                </View>
            )}
      </ScrollView >
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
    