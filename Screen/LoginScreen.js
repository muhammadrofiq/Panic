import React, { Component } from 'react'
import { getPerusahaanList, loginAdminAssessment } from './../manager/connection/loginConnectionManager';
import { Alert, ImageBackground, Dimensions, ActivityIndicator, TextInput, View, ScrollView, Platform, StyleSheet, Image } from 'react-native'
import constants from '../value/Colors';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { Picker, Content, Text, Icon, Form } from 'native-base';
import { TouchableHighlight, TouchableWithoutFeedback, TouchableNativeFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Loader from './component/Loader'

class loginScreenMain extends Component {

    constructor(props) {
        super(props);
        this.getUserData()
    }
    state = {
        company: "0",
        userName: "",
        password: "",
        isLoading: false,
        isLoadLoginPage: true,
        isFetchLogin: false,
        companyList: Array(),
        userData: null

    }

    storeUserData = async (key, data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data))
        } catch (e) {
            console.log(e)
            Alert.alert("Information!", 'Save Data Failed')
        }
    }

    getUserData = async () => {
        try {
            const value = await AsyncStorage.getItem("userData")
            if (value !== null) {
                var user = JSON.parse(value)
                this.setState({
                    userName: user.username,
                    password: user.password,
                    company: user.perusahaan

                })
                this.doLogin()
                // this.props.navigation.navigate('Home');
            } else {
                // getPerusahaanList().then(data => {
                //     if (data.status) {
                //         this.setState({
                //             companyList: data.data,
                //             isLoadLoginPage: true
                //         })
                //     }
                // })
                // DO GET PERUSAHAAN AND LET FLOW WORK
            }
        } catch (e) {
            console.log("filed get local data :" + e)
            Alert.alert("Information!", 'Get Data Failed')
            clearAll((error) => {
                if (error) {
                }
            })
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

    handleLogin = (data) => {
        data.data["password"] = this.state.password
        console.log("user data save to local login page :" , data.data)
        this.props.updatedataProfile(JSON.stringify(data.data));
        this.storeUserData("userData", data.data)
        //this.props.navigation.navigate('Home');
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
    }
    onLoginClicked = () => {
        if (this.state.userName == "" || this.state.password == "") {
            console.log("jajaj")
            Alert.alert("Information!", "Invalid Password or Username!")
            return
        }
        this.setState({
            isFetchLogin: true
        })
        this.doLogin()


    }
    doLogin() {
        this.timeout(3000, loginAdminAssessment({
            user: this.state.userName,
            password: this.state.password
        })).then((response) => {
            console.log("TCL: loginScreenMain -> onLoginClicked -> response", response)
            if (response.success) {
                this.setState({
                    isFetchLogin: false
                })
                this.handleLogin(response)
            } else {
                if (Platform.os === 'android') {
                    this.setState({
                        isFetchLogin: false
                    })
                    Alert.alert("Information!", "Login Failed!")
                } else {
                    Alert.alert("Information!", "Login Failed!", [{
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
            console.log("ERROR TIMEOUT! : " + error);
            Alert.alert("Information!", error + "", [{
                text: "OK",
                onPress: () => {
                    this.setState({
                        isFetchLogin: false
                    })
                }
            }])
        });
    }

    onSelectValue = (selectedValue) => {
        if (selectedValue != "0") {
            this.setState({
                company: selectedValue
            })
        }
    }

    loadLoadingScreen() {
        if (!this.state.isLoadLoginPage) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
                    <LinearGradient useAngle={true} angle={90} colors={[constants.themeLightBlue, constants.themeDarkBlue]} style={{ marginRight: 46, marginLeft: 46, borderRadius: 30 }}>
                        {
                            Platform.OS === 'android' ?
                                <TouchableNativeFeedback style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", marginTop: 4, marginBottom: 4 }} onPress={this.onLoginClicked}>
                                    <Text style={{ letterSpacing: 2, fontSize: 14, margin: 16, color: constants.themeWhite, textAlign: "center", fontFamily: "Montserrat-Medium" }}>
                                        Fetching data
                                </Text>
                                    <ActivityIndicator size="small" color={constants.themeWhite} />
                                </TouchableNativeFeedback> :
                                <TouchableHighlight style={{ flexDirection: "row", alignContent: "center", justifyContent: "center", marginTop: 4, marginBottom: 4 }} onPress={this.onLoginClicked}>
                                    <View>
                                        <Text style={{ letterSpacing: 2, fontSize: 14, margin: 16, color: constants.themeWhite, textAlign: "center", fontFamily: "Montserrat-Medium" }}>
                                            Fetching data
                                    </Text>
                                        <ActivityIndicator size="small" color={constants.themeWhite} />
                                    </View>
                                </TouchableHighlight>
                        }
                    </LinearGradient>
                </View>
            )
        }
    }
    loadLoginScreen() {
        const screenWidth = Math.round(Dimensions.get('window').width);

        if (this.state.isLoadLoginPage) {
            const screenWidth = Math.round(Dimensions.get('window').width) - 32;
            return (

                <View style={{ flex: 1 }}>
                    <ScrollView style={{ flex: 1 }}>
                        {/* <View style={{alignItems:"center", alignContent:"center", justifyContent:"center" ,marginTop:64}}>
                                <Image 
                                        resizeMode="contain"
                                        source = {require('./../../assets/trans.png')}
                                        style={{
                                            height: 120, 
                                            width:120}}/>
                            </View> */}
                        <TouchableWithoutFeedback onPress={this.onImageClick} style={{ height: 200, width: null, flex: 1, marginTop: 86, marginLeft: 16, marginRight: 16 }}>
                            {/* <Image resizeMode='contain'
                                    source = {require('./../assets/logo-assessment.png')}
                                    style={{height: 200, width: null, flex: 1}}/> */}
                        </TouchableWithoutFeedback>
                        <View style={{ marginBottom: 16, marginRight: 20, marginLeft: 20, borderRadius: 8, backgroundColor: 'rgba(20,15,38,0.67)' }}>
                            <View style={{ alignContent: "center", justifyContent: "center", flexDirection: "row" }}>
                                <View style={{ paddingRight: 16, paddingLeft: 16, alignContent: "center", justifyContent: "center" }}>
                                    <Icon name="person" size={20} style={{ color: constants.themeWhite }} />
                                </View>
                                <View style={{ alignContent: "center", justifyContent: "center", flex: 1 }}>
                                    <TextInput
                                        onChangeText={(userNameInput) => { this.setState({ userName: userNameInput }) }}
                                        autoCorrect={false}
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        placeholderTextColor={constants.themeSoftWhite}
                                        placeholder="User Name"
                                        textContentType="none"
                                        autoComplete="off"
                                        style={{ fontFamily: "Montserrat-Medium", color: constants.themeWhite, fontSize: 12 }} />
                                </View>
                            </View>
                        </View>
                        <View style={{ marginBottom: 24, marginRight: 20, marginLeft: 20, borderRadius: 8, backgroundColor: 'rgba(20,15,38,0.67)' }}>
                            <View style={{ alignContent: "center", justifyContent: "center", flexDirection: "row" }}>
                                <View style={{ paddingRight: 16, paddingLeft: 16, alignContent: "center", justifyContent: "center" }}>
                                    <Icon style={styles.loginIcon} name="lock" size={20} style={{ color: constants.themeWhite }} />
                                </View>
                                <View style={{ alignContent: "center", justifyContent: "center", flex: 1 }}>
                                    <TextInput
                                        onChangeText={(PasswordInput) => { this.setState({ password: PasswordInput }) }}
                                        secureTextEntry={true}
                                        textContentType="none"
                                        autoComplete="off"
                                        placeholderTextColor={constants.themeSoftWhite}
                                        placeholder="Password"
                                        style={{ fontFamily: "Montserrat-Medium", color: constants.themeWhite, fontSize: 12 }} />
                                </View>
                            </View>
                        </View>

                        {/* <View style={{ marginBottom: 24, marginLeft: 20, height: 40, marginRight: 20, borderRadius: 8, backgroundColor: 'rgba(20,15,38,0.4)' }}>
                            <Content>
                                <Form>
                                    <Picker
                                        textStyle={{ fontFamily: "Montserrat-Medium", color: constants.themeWhite, fontSize: 14 }}
                                        placeholderStyle={{ color: constants.themeWhite }}
                                        itemStyle={{ fontFamily: "Montserrat-Medium", color: constants.themeWhite }}
                                        selectedValue={this.state.company}
                                        style={{ marginLeft: 8, fontFamily: "Montserrat-Medium", fontSize: 8, height: 40, width: screenWidth - 40, color: constants.themeWhite }}
                                        onValueChange={(itemValue, itemIndex) =>
                                            this.onSelectValue(itemValue)
                                        }>
                                        <Picker.Item style={{ fontFamily: "Montserrat-Medium" }} enabeled={false} label="Select Company" value="0" />
                                        {generatePickeritem(this.state.companyList)}
                                    </Picker>
                                </Form>
                            </Content>
                        </View> */}
                        <View>
                            <LinearGradient onPress={this.onLoginClicked} useAngle={true} angle={45} colors={[constants.themeLightBlue, constants.themeDarkBlue]} style={{ marginRight: 20, marginLeft: 20, borderRadius: 30 }}>
                                {
                                    Platform.OS === 'android' ?
                                        <TouchableNativeFeedback onPress={this.onLoginClicked}>
                                            <Text onPress={this.onLoginClicked} style={{ letterSpacing: 2, fontSize: 14, margin: 12, color: constants.themeWhite, textAlign: "center", fontFamily: "Montserrat-Medium" }}>
                                                LOGIN
                                            </Text>
                                        </TouchableNativeFeedback> :
                                        <TouchableHighlight onPress={this.onLoginClicked}>
                                            <Text onPress={this.onLoginClicked} style={{ letterSpacing: 2, fontSize: 14, margin: 12, color: constants.themeWhite, textAlign: "center", fontFamily: "Montserrat-Medium" }}>
                                                LOGIN
                                            </Text>
                                        </TouchableHighlight>
                                }
                            </LinearGradient>
                        </View>
                        {
                            Platform.OS === 'android' ?
                                null
                                :
                                <View>
                                    <View style={{ borderWidth: 0.4, borderColor: constants.darkSoftBlue, marginRight: 16, marginLeft: 16, marginTop: 16 }}></View>
                                    <View style={{ marginTop: 24 }}>
                                        <LinearGradient useAngle={true} angle={45} colors={["#f15887", "#fe9b86"]} style={{ marginRight: 20, marginLeft: 20, borderRadius: 30 }}>
                                            <TouchableHighlight onPress={() => { this.props.onRegisterClicked() }} >
                                                <Text style={{ letterSpacing: 2, fontSize: 14, margin: 12, color: constants.themeWhite, textAlign: "center", fontFamily: "Montserrat-Medium" }}>
                                                    REGISTER
                                            </Text>
                                            </TouchableHighlight>
                                        </LinearGradient>
                                    </View>
                                </View>

                        }

                    </ScrollView>
                </View>
            )
        }

    }

    render() {
        return (
            <ImageBackground
                blurRadius={this.state.isLoadLoginPage ? 0.8 : 2}
                source={require('./../assets/mainBackground.png')}
                style={{
                    flex: 1, width: '100%',
                    height: '100%'
                }}>
                <Loader loading={this.state.isFetchLogin}></Loader>
                {this.loadLoadingScreen()}
                {this.loadLoginScreen()}
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        backgroundColor: '#fff',
        color: '#424242',
    }
});


const updatedataProfile = userData => ({
    type: 'DATA_PROFILE',
    payload: {
        userData
    }
});
const mapStateToProps = state => {
    const { dataProfile } = state;
    return { dataProfile };
};
export default connect(mapStateToProps, { updatedataProfile })(loginScreenMain)