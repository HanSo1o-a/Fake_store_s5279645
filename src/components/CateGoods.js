import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation ,useFocusEffect } from '@react-navigation/native';
import { getRequest } from '../utils/request.js';
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

function CateGoods({navigation, route}) {
    const title = route.params;
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const safePadding = '5%';
    const [data, setData] = useState([]);
    const fetchData = async (title) => {
        try {
            const response = await getRequest('https://fakestoreapi.com/products/category/'+title);
            setData(response);
          } catch (error) {
            console.error('GET 请求出错:', error);
        }
      };
    fetchData(title);
    function renderItem({ item }) {
      return (
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ProductDetail', item.id)}>
              <Image
                    source={{ uri: item.image }} 
                    style={styles.goodsLogo} 
              />
              <View style={{flex:1, height: '100%'}}>
                <View style={{ width: 230, marginLeft: 10, flexDirection: 'column', height: 100}}>
                    <Text style={{  color : '#2A6DC7', flex:1}} >{item.title}</Text>
                    <View style={{ display:'flex', flexDirection: 'row'}}>
                        <Text style={{ color : '#000000', fontWeight: 'bold'}} >Price: </Text>
                        <Text style={{ color : '#000000'}} >${item.price}</Text>
                    </View>
                </View>
            </View>
          </TouchableOpacity>
      );
  }
    

    return (
      <View style={{ display: 'flex', flexDirection:'column', height: '100%' }}>
        <StatusBar
            hidden
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
                {title}
            </Text>
        </View>

        <View style={styles.listContainer}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>

        <View  style={{ flexDirection: 'row' , justifyContent: 'center'}}>
            <TouchableOpacity onPress={()=> navigation.goBack()} style={{ flexDirection: 'row' , width: 80, alignItems: 'center', justifyContent:'center', backgroundColor: '#47A2D1', borderRadius: 6,  borderWidth: 2,  padding: 5 ,borderColor: 'black'}}>
            <Image
                style={{ width: 15, height: 15 }}
                source={    
                    require('../../images/backspace.png')}
            />
            <Text style={{ color: 'white', marginLeft: 10}}>Back</Text>
            </TouchableOpacity>
        </View>
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

export default CateGoods;
    