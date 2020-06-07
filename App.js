import React, { Fragment, useState, useEffect } from 'react';
import { Text, Alert } from 'react-native'
import { Root } from "native-base";
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import Home from './Screen/Home'
import Splash from './Screen/Splash'
import Menu from './Screen/ResetPassword'
import Login from './Screen/LoginScreen'
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from './Screen/ResetPassword';
import Anggota from './Screen/Anggota';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification"


const Stack = createStackNavigator();

function rootReducer(state = initialState, action) {
    // console.log(action)
    switch (action.type) {
        case 'DATA_PROFILE':
            const { userData } = action.payload;
            return { ...state, userData };
        case 'BATU':
            const { batu } = action.payload;
            return { ...state, batu };
        default:
            return state;
    }
}

const initialState = {
    userData: {},
    batu: ""
}

const store = createStore(rootReducer);


export default class App2 extends React.Component {

    state = {
        loading: true,
        adaDataLocal: false
    }

    constructor(properties) {
        super(properties);
        this.getUserData()

        PushNotification.configure({

            onRegister: function (token) {
                console.log('TOKEN:', token);
            },
            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
    }


    getUserData = async () => {
        try {
            const value = await AsyncStorage.getItem("userData")
            if (value !== null) {

                // this.unsubscribe = messaging().onMessage(async remoteMessage => {
                //     // console.log("hahah ada pesan :" , remoteMessage.notification)
                //     this.testPush(remoteMessage.notification.title, remoteMessage.notification.body)
                // });

                // messaging().setBackgroundMessageHandler(async remoteMessage => {
                //     console.log('Message handled in the background!', remoteMessage);
                // });

                this.setState({
                    loading: false,
                    adaDataLocal: true,
                    userData: value
                })
                // this.props.navigation.navigate('Home');
            } else {
                this.setState({
                    loading: false,
                    adaDataLocal: false
                })
            }
        } catch (e) {
            // console.log("filed get local data :" + e)
            Alert.alert("Information!", 'Get Data Failed')
            clearAll((error) => {
                if (error) {
                }
            })
        }
    }

    // async componentDidMount() {
    //     this.checkPermission();
    //   }

    showAlert(title, body) {
        Alert.alert(
            title, body,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }

    requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            this.getFcmToken() //<---- Add this
            console.log('Authorization status:', authStatus);
        }
    }

    getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
            console.log("Your Firebase Token is:", fcmToken);
        } else {
            console.log("Failed", "No token received");
        }
    }

    componentDidMount() {
        this.requestUserPermission();
        // this.testPush()
    }
    componentWillUnmount() {
        this.unsubscribe = null
    }

    render() {
        // console.log("render parent")
        if (this.state.loading) {
            return (
                <Splash></Splash>
            )
        }

        return (
            <Root>
                <Provider store={store}>
                    <NavigationContainer>
                        <Stack.Navigator>
                            {
                                this.state.adaDataLocal ? null :
                                    <Stack.Screen
                                        name="Login"
                                        component={Login}
                                        options={{
                                            title: 'Overview',
                                            headerShown: false
                                        }}
                                    />
                            }
                            <Stack.Screen
                                name="Home"
                                component={Home}
                                options={{
                                    title: 'Overview',
                                    headerShown: false
                                }}
                            />
                            <Stack.Screen
                                name="Anggota"
                                component={Anggota}
                                options={{
                                    headerShown: false
                                }}
                            />
                            <Stack.Screen
                                name="Login2"
                                component={Login}
                                options={{
                                    title: 'Overview',
                                    headerShown: false
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </Provider>
            </Root>
        );
    }
}
