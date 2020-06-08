import React, { Component } from 'react';
import { ScrollView } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Left, Icon, Container, Header, Title, Content, Footer, FooterTab, Button, Right, Body, Text } from 'native-base';
export default class Sidebar extends Component {
    clearAsyncStorage = async () => {
        AsyncStorage.clear();
    }
    render() {
        console.log("user Data di sidebar:", this.props.getUserData())
        return (
            <Container>
                <Header>
                    <Body>
                        <Title style={{ fontSize: 17, fontFamily: "Montserrat-Light" }}>Menu</Title>
                    </Body>
                    <Right />
                </Header>
                <Content padder>
                    <ScrollView>
                        <Text style={{ marginBottom: 8, fontFamily: "Montserrat-Medium" }} >{"WELCOME , "+ this.props.getUserData().nama.toUpperCase()}</Text>
                        <ListItem icon
                            onPress={() => {
                                this.props.navigation.navigate('Anggota')
                                this.props.closeDrawer()
                            }}
                        >
                            <Left>
                                <Button style={{ backgroundColor: "#007AFF" }}>
                                    <Icon active name="person" />
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 14, fontFamily: "Montserrat-Light" }}>Anggota</Text>
                            </Body>
                        </ListItem>
                        <ListItem icon onPress={() => {
                            this.props.onLogout()
                        }}>
                            <Left>
                                <Button style={{ backgroundColor: "#007AFF" }}>
                                    <Icon active name="md-exit" />
                                </Button>
                            </Left>
                            <Body>
                                <Text style={{ fontSize: 14, fontFamily: "Montserrat-Light" }}>Logout</Text>
                            </Body>
                        </ListItem>
                    </ScrollView>
                </Content>
            </Container>
        );
    }
}