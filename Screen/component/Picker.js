import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Dimensions,
  FlatList,
  View,
  TouchableOpacity,
  Modal,
  Text,
  ActivityIndicator,
  Image,
  TextInput,
  Platform,
  Button
} from 'react-native';
import { Badge, Icon, Avatar, SearchBar, ListItem, Right, Content, Container } from 'native-base';
import { insertUser } from './../../manager/connection/userDataConnectionManager';

export default class Picker extends Component {

  constructor(props) {
    super(props);
    console.log("user data pada picker", props.userData)
    this.state = {
      userData: JSON.parse(props.userData),
      search: "",
      nama: "",
      password: "",
      loading: false,
      pickerFiltered: this.props.data
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != undefined && this.state.search == "") {
      this.setState({ pickerFiltered: nextProps.data })
    }
  }

  _FlatListItemSeparator = () => <View style={styles.line} />;
  // _keyExtractor = (item, index) => item.id.toString();


  _search = (search) => {
    this.setState({ search: search }, () => {
      // this._postSearch();
      var result = this.props.data
      if (search != "") {
        result = this.props.data.filter(data => data.value.toUpperCase().includes(search.toUpperCase()));
      }
      this.setState({ pickerFiltered: result })
    });
  }


  insertUser() {
    this.setState({ loading: true })
    this.timeout(3000, insertUser({
      user: this.state.userData.nama,
      password: this.state.userData.password,
      newUser: this.state.nama,
      newPassword: this.state.password
    })).then((response) => {
      if (response.success) {
        this.setState({
          loading: false,
          failedMessage: ""
        })
        this.props.onSuccessAdd()
      } else {
        this.setState({
          loading: false,
          failedMessage: response.message
        })
        // todo do error message here
      }

    }).catch((error) => {
      console.log(error)
    });
  }


  timeout(milliseconds, promise) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Request Timeout"))
      }, milliseconds)
      promise.then(resolve, reject)
    })
  }

  render() {
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.show}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ marginTop: 20, fontSize: 16, fontFamily: 'Montserrat-Bold', marginBottom: 20 }}>{this.props.title != null || this.props.title != undefined ? this.props.title.toUpperCase() : "TITLE"}</Text>
            </View>
            <Container>
              <Content>
                <TextInput
                  value={this.state.nama}
                  onChangeText={text => this.setState({ nama: text.replace(/\s/g, '') })}
                  placeholder={"Input Nama"}
                  style={{ borderRadius: 8, borderWidth: 0.5, marginRight: 16, marginLeft: 16 }}
                  // {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                  editable
                  maxLength={40}
                />
                <TextInput
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                  placeholder={"Input Password"}
                  style={{ borderRadius: 8, borderWidth: 0.5, marginRight: 16, marginLeft: 16, marginTop: 18 }}
                  // {...props} // Inherit any props passed to it; e.g., multiline, numberOfLines below
                  editable
                  maxLength={40}
                />
                <View style={{ borderRadius: 8, marginTop: 32, marginRight: 64, marginLeft: 64 }}>
                  {
                    this.state.loading ? <ActivityIndicator style={{ marginBottom: 14 }} size="large" color="#0000ff" />
                      : null
                  }
                  <Button
                    title="add"
                    onPress={() => this.insertUser()}
                  />
                </View>
                <View style={{alignContent:"center",alignItems:"center"}}>
                  <Text style={{color:"#FF4C4C", marginTop: 20, fontSize: 16, fontFamily: 'Montserrat-Bold', marginBottom: 20 }}>{this.state.failedMessage}</Text>
                </View>

              </Content>
            </Container>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontFamily: 'Montserrat-Bold', marginTop: 10, marginBottom: 10 }} onPress={() => { this.props.onClosed() }}>CLOSE</Text>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height - 250,
    width: Dimensions.get('window').width - 100,
    borderRadius: 10,
    alignContent: "center",
  },
  line: {
    marginRight: 8,
    marginLeft: 16,
    height: 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  },
  isEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    flex: 1
  },
  textEmpty: {
    color: 'red',
    fontFamily: 'Montserrat-Light',
    fontWeight: 'bold'
  }
});
