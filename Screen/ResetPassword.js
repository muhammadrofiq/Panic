import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loader from './component/Loader'
import { View, FlatList, Platform, Alert } from 'react-native';
import { Thumbnail, Card, Item, Input, Container, Header, Title, Content, ListItem, Subtitle, Button, Left, Right, Body, Icon, Text } from 'native-base';
import SideBar from './component/Sidebar';
import { timeout, getUserData, resetPassword } from './../manager/connection/userDataConnectionManager';
class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading:false,
            search: "",
            userData: []
        };
    }

    closeDrawer() {
        this._drawer._root.close()
    };
    openDrawer() {
        this._drawer._root.open()
    };

    getUserData() {
        this.setState({isLoading:true})
        timeout(3000, getUserData({
            nik: this.props.userData.npk,
            perusahaan: this.props.userData.perusahaan,
            token: this.props.userData.token,
            userNik: this.state.search
        })).then((response) => {
            console.log("TCL: loginScreenMain -> onLoginClicked -> response", response)
            if (response.status) {
                this.setState({ userData: response.data })
                this.setState({
                    isLoading: false
                })
                if(response.data.length==0){
                    Alert.alert("Information!", "user tidak ditemukan")
                }
            } else {
                if (Platform.os === 'android') {
                    this.setState({
                        isLoading: false
                    })
                    Alert.alert("Information!", "Fetch Data Failed " + response)
                } else {
                    Alert.alert("Information!", "Fetch Data Failed!" + response, [{
                        text: "OK",
                        onPress: () => {
                            this.setState({
                                isLoading: false
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
                        isLoading: false
                    })
                }
            }])
        });
    }

    doReset(npk) {
        this.setState({isLoading:true})
        timeout(3000, resetPassword({
            nik: this.props.userData.profile.npk,
            perusahaan: this.props.userData.profile.perusahaan,
            token: this.props.userData.token,
            userNik: npk,
            newPassword: npk
        })).then((response) => {
            console.log("reset password response ->", response)
            if (response.status) {
                Alert.alert("Information!", "Reset Password success")
                this.setState({
                    isLoading: false
                })
            } else {
                if (Platform.os === 'android') {
                    this.setState({
                        isLoading: false
                    })
                    Alert.alert("Information!", "Reset Password failed")
                } else {
                    Alert.alert("Information!", "Reset Password failed", [{
                        text: "OK",
                        onPress: () => {
                            this.setState({
                                isLoading: false
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
                        isLoading: false
                    })
                }
            }])
        });
    }

    renderList(data) {
        return (
            <ListItem avatar onPress={() => this.props.navigation.goBack()}>
                <Left>
                    <Thumbnail source={{ uri: 'https://hc.transtv.co.id/images/foto-' + data.perusahaan + '/' + data.npk + '.gif' }} />
                </Left>
                <Body>
                    <Text style={{ fontSize:15, fontFamily: "Montserrat-Medium"}} onPress={()=>{console.log("pressed")}}>{data.nama}</Text>
                    <Text style={{ fontSize:14, fontFamily: "Montserrat-Light"}} note>{"[" + data.perusahaan + "] - " + data.npk}</Text>
                </Body>
                <Right onPress>
                    {/* <Text note>3:43 pm</Text> */}
                    <Button
                        small
                        success
                        onPress={() =>
                            Alert.alert(
                                'Confirmation !',
                                'Reset Password '+ data.nama+ " ?",
                                [
                                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                    { text: 'OK', onPress: () => this.doReset(data.npk) },
                                ],
                                { cancelable: false }
                            )
                        }
                    >
                        <Text style={{ fontSize:13, fontFamily: "Montserrat-Medium"}}>Reset</Text>
                    </Button>
                </Right>
            </ListItem>
        )
    }

    render() {
        const DATA = [
            {
                id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                title: 'First Item',
            },
            {
                id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
                title: 'Second Item',
            },
            {
                id: '58694a0f-3da1-471f-bd96-145571e29d72',
                title: 'Third Item',
            },
        ];
        return (
            <Container>
                <Loader loading={this.state.isLoading}></Loader>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body>
                        <Title style={{ fontSize:17, fontFamily: "Montserrat-Medium"}}>Reset</Title>
                        <Subtitle style={{ fontSize:14, fontFamily: "Montserrat-Light"}}>Password</Subtitle>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <Header
                        style={{ marginTop: 4, backgroundColor: "#FFF" }}
                        searchBar
                        rounded>
                        <Item style={{}}>
                            <Icon name="ios-search" />
                            <Input
                                style={{ fontSize:14, fontFamily: "Montserrat-Light"}}
                                placeholder="Search NIK or Name"
                                onChangeText={text => this.setState({ search: text })}
                                onBlur={()=>{this.getUserData()}}
                            />
                            <Icon name="ios-people" />
                        </Item>
                        <Button
                            onPress={() => {
                                this.getUserData()
                            }}
                            transparent>
                            <Text>Search nik or name</Text>
                        </Button>
                    </Header>
                    {
                        this.state.userData.length > 0 ?
                            <Card>
                                <FlatList
                                    data={this.state.userData}
                                    renderItem={({ item }) => this.renderList(item)}
                                    keyExtractor={item => item.npk}
                                />
                            </Card> : null
                    }
                </Content>
            </Container>
        );
    }
}



const updatedataProfile = dataProfile => ({
    type: 'DATA_PROFILE',
    payload: {
        dataProfile
    }
});
const mapStateToProps = state => {
    const { userData } = state;
    return { userData };
};
export default connect(mapStateToProps, { updatedataProfile })(ResetPassword)