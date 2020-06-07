import React, { Component } from 'react'
import { Text, View ,ActivityIndicator} from 'react-native'

export default class Splash extends Component {
    render() {
        return (
            <View style = {{flex:1, alignContent : "center", justifyContent:"center", alignItems:"center"}}>
                {/* <Text> Splash screen </Text> */}
                <ActivityIndicator
                    size={'large'}
                ></ActivityIndicator>
            </View>
        )
    }
}
