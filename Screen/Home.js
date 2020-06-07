
import { connect } from 'react-redux';
import React, { Component } from 'react';
import io from "socket.io-client";
import AsyncStorage from '@react-native-community/async-storage';
import { loginAdminAssessment } from './../manager/connection/loginConnectionManager';
import { getStatistikUserDataTahunan } from './../manager/connection/statistikConnectionManager';
import { View, Alert, Platform, ActivityIndicator, Dimensions, Image } from 'react-native';
import { Card, Drawer, CardItem, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import SideBar from './component/Sidebar';
import { TouchableHighlight, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native-gesture-handler';
import PushNotification from "react-native-push-notification"
import messaging from '@react-native-firebase/messaging';

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

        this.socket = io("http://10.0.2.2:3000/");
        this.socket.on("join", msg => {
            console.log("ada yang masuk nih! ,", msg)
        });

        this.unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log(remoteMessage)
            this.testPush(remoteMessage.notification.title, remoteMessage.notification.body)
        });

        messaging()
            .subscribeToTopic('global')
            .then(() => console.log('Subscribed to topic!'));
    }

    testPush(title,message) {
        PushNotification.localNotification({
            title: title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
            message:message// (required)
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
                // this.handleLogin(response, userData.password)
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
        this.socket.emit('join', "ROFIQ");
        // this.testPush()
    };

    clearAsyncStorage = async () => {
        AsyncStorage.clear();
    }

    render() {
        console.log("user data di home :", this.props.userData)
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
                                {/* <Text style={{ fontSize: 14, fontFamily: "Montserrat-Light" }}>Jumlah Karyawan Aktif</Text>
                                <LineChart
                                    data={{
                                        labels: this.state.label,
                                        datasets: [
                                            {
                                                data: this.state.dataSet
                                            }
                                        ]
                                    }}
                                    width={Dimensions.get("window").width - 16} // from react-native
                                    height={220}
                                    // yAxisLabel="$"
                                    // yAxisSuffix="k"
                                    yAxisInterval={1} // optional, defaults to 1
                                    chartConfig={{
                                        backgroundColor: "#e26a00",
                                        backgroundGradientFrom: "#fb8c00",
                                        backgroundGradientTo: "#ffa726",
                                        decimalPlaces: 0, // optional, defaults to 2dp
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        style: {
                                            borderRadius: 16
                                        },
                                        propsForDots: {
                                            r: "6",
                                            strokeWidth: "2",
                                            stroke: "#ffa726"
                                        }
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16
                                    }}
                                /> */}
                                <TouchableWithoutFeedback onPress={() => {
                                    console.log("button pressed")
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