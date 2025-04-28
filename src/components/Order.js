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

function Categories({navigation}) {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    const safePadding = '5%';
    const [data, setData] = useState([]);
    function renderItem({ item }) {
      return (
          <View style={styles.listItem}>
              <Text style={{   color : '#2A6DC7'}} onPress={() => navigation.navigate('CateGoods', item)}>{item}</Text>
          </View>
      );
  }
    const fetchData = async () => {
      try {
          const response = await getRequest('https://fakestoreapi.com/products/categories');
          console.log(response);
          setData(response);
        } catch (error) {
          console.error('GET error:', error);
      }
    };
      useEffect(() => {
        fetchData();
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
                Categories
            </Text>
        </View>

        <View style={styles.listContainer}>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
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
    }
});

export default Categories;
    