
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View, Alert, Platform, ActivityIndicator, Dimensions, Image, ToastAndroid } from 'react-native';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';
import { loginAdminAssessment } from './../manager/connection/loginConnectionManager';
import { getStatistikUserDataTahunan } from './../manager/connection/statistikConnectionManager';
import { Card, Drawer, CardItem, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import SideBar from './component/Sidebar';
import { TouchableHighlight, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native-gesture-handler';
import PushNotification from "react-native-push-notification"
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import messaging from '@react-native-firebase/messaging';
import ServerValue from './../value/Server';
import PushNotification2 from '../value/IosNotif';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFetchLogin: true,
            label: [],
            dataSet: []
        };
        this.getUserData()
        this.getStatistik()
        console.log("server:", ServerValue.main)
        this.socket = io(ServerValue.main);
        this.socket.on("join", msg => {
            console.log("ada yang masuk nih! ,", msg)
        });

        this.unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log("remote  message :", remoteMessage+ " | platfom :" , Platform.OS)
            if (Platform.OS === 'android') {
                this.testPush(remoteMessage.notification.title, remoteMessage.notification.body)
                console.log("push notif local android :")
            } else {
                console.log("push notif local Ios :")
                this.testPush(remoteMessage.data.notification.title, remoteMessage.data.notification.body)
            }
        });

        messaging()
            .subscribeToTopic('global')
            .then(() => console.log('Subscribed to topic!'));

        this.notification = new PushNotification2(this.onNotification);
    }

    testPush(title, message) {
        PushNotification.localNotification({
            vibrate:true,
            // smallIcon:"ic_launcher",

            title: title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message: message// (required)
        });
    }

    getStatistik() {
        var label = []
        var dataSet = []
        this.timeout(3000, getStatistikUserDataTahunan()).then((response) => {

            for (const property in response[0].data) {
                label.push(response[0].data[property][0])
                dataSet.push(response[0].data[property][1])
            }
            this.setState({
                label: label.reverse(),
                dataSet: dataSet.reverse()
            })
        }).catch((error) => {
        });
    }

    closeDrawer() {
        this._drawer._root.close()
    };
    openDrawer() {
        this._drawer._root.open()
    };

    getUserData = async () => {
        try {
            const value = await AsyncStorage.getItem("userData")
            this.setState({ userData: JSON.parse(value) })
            this.props.updatedataProfile(value);
            this.doLogin(JSON.parse(value))
            //return value
        } catch (e) {
            console.log("error get data", e)
            //return null
        }
    }

    timeout(milliseconds, promise) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error("Request Timeout"))
            }, milliseconds)
            promise.then(resolve, reject)
        })
    }

    doLogin(userData) {
        console.log(userData)
        this.timeout(3000, loginAdminAssessment({
            user: userData.nama,
            password: userData.password
        })).then((response) => {
            if (response.success) {
                this.setState({
                    isFetchLogin: false
                })
                this.socket.emit('join', userData.nama);
            } else {
                //DO NAVIGATE TO LOGIN
                if (Platform.os === 'android') {
                    this.setState({
                        isFetchLogin: false
                    })
                    Alert.alert("Information!", "Login Failed!")
                } else {
                    Alert.alert("Information!", "Login Failed!" + JSON.stringify(response), [{
                        text: "OK",
                        onPress: () => {
                            this.setState({
                                isFetchLogin: false
                            })
                        }
                    }])
                }
            }

        }).catch((error) => {
            this.doLogin(userData)
        });
    }

    storeUserData = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
        } catch (e) {
            Alert.alert("Information!", 'Save Data Failed')
        }
    }

    handleLogin = (data, password) => {
        data.data["password"] = password
        // console.log("user data save to local home :", data.data)
        this.props.updatedataProfile(data.data);
        this.storeUserData("userData", data.data)
    }

    componentDidMount() {
    };

    clearAsyncStorage = async () => {
        AsyncStorage.clear();
    }

    render() {
        console.log("user data di home :", this.props.userData, "fetch login status :", this.state.isFetchLogin)
        if (
            !this.state.isFetchLogin
        ) {
            return (
                <Drawer
                    ref={(ref) => { this._drawer = ref; }}
                    content={<SideBar
                        onLogout={() => {
                            this.unsubscribe = null
                            messaging().unsubscribeFromTopic('global')
                            this.clearAsyncStorage().then(() => {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login2' }],
                                });
                            })
                        }}
                        getUserData={() => { return JSON.parse(this.props.userData) }}
                        closeDrawer={() => this.closeDrawer()} navigation={this.props.navigation} />}
                    onClose={() => this.closeDrawer()} >
                    <Container>
                        <Header>
                            <Left>
                                <Button transparent onPress={() => this.openDrawer()}>
                                    <Icon name='menu' />
                                </Button>
                            </Left>
                            <Body>
                                <Title style={{ fontSize: 17, fontFamily: "Montserrat-Light" }}>Panic Button</Title>
                            </Body>
                            <Right />
                        </Header>
                        <Content padder>
                            <View style={{ marginTop: 32, alignContent: "center", alignItems: "center", flex: 1 }}>
                                <TouchableWithoutFeedback onPress={() => {
                                    console.log("button pressed")
                                    if (Platform.OS === 'android') {
                                        ToastAndroid.showWithGravityAndOffset(
                                            "Send Notif to All User",
                                            ToastAndroid.LONG,
                                            ToastAndroid.BOTTOM,
                                            25,
                                            50
                                        );
                                    }
                                    this.socket.emit('panic', JSON.parse(this.props.userData).nama);
                                }}>
                                    <Image style={{ width: Dimensions.get('window').width - 64, height: Dimensions.get('window').width - 64 }} source={require('./../assets/panicButton.png')} />
                                </TouchableWithoutFeedback>
                            </View>
                        </Content>
                    </Container>
                </Drawer>
            );
        }
        else {
            return (
                <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )
        }

    }
}


const updatedataProfile = userData => ({
    type: 'DATA_PROFILE',
    payload: {
        userData
    }
});
const mapStateToProps = state => {
    const { userData, batu } = state;
    return { userData, batu };
};
export default connect(mapStateToProps, { updatedataProfile })(Home)