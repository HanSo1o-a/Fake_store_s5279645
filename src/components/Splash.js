import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';

function Splash({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('TabNavigator'); 
        }, 3000); 

        return () => clearTimeout(timer);
    }, []);
    return (
        <SafeAreaView style={styles.fullScreen}>
            <View style={styles.container}>
                <Image
                    source={require('../../assets/splash.png')}
                    style={styles.image}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: '#000' 
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    }
});

export default Splash;
    