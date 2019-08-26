import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { SingleContact, LogoName } from '../views'
import actions from '../../redux/actions'
import config from '../../config'
import { AntDesign } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { Video } from 'expo-av'

//https://github.com/react-navigation/react-navigation/issues/5454

class AddressBook extends React.Component {

    constructor() {
        super()
        this.state = {
            newMessage: {
                toUser: '',
                username: ''
            },
            contacts: [],
            profileImage: '',
            pushToken: '',
            showCreateMessage: null,
            userId: '',
            userName: ''
        }
        //this.navigateToSendMessageFromAddressBook = this.navigateToSendMessageFromAddressBook.bind(this)
    }

    async navigateToSendMessageFromAddressBook(contact) {
        await this.setState({
            newMessage: {
                toUser: contact.phoneNumbers[0].digits,
                username: contact.name
            },
            showCreateMessage: true,
        })
        await this.props.userReceived(this.state)
        await this.props.navigation.navigate('home')
    }

    async componentDidMount() {
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content')
        })
        await Font.loadAsync({
            'helvetica-bold': require('../../fonts/Helvetica-Bold.ttf'),
            'cinzel-regular': require('../../fonts/Cinzel-Regular.ttf')
        })
        await this.setState({
            fontLoaded: true,
            contacts: this.props.state.account.user.contacts,
            profileImage:  this.props.state.account.user.profileImage,
            pushToken:  this.props.state.account.user.pushToken,
            showCreateMessage:  this.props.state.account.user.showCreateMessage,
            userId:  this.props.state.account.user.userId,
            username:  this.props.state.account.user.username
        })
    }

    componentWillUnmount() {
        this._navListener.remove()
    }

    render() {

        return(
            <View style={styles.container}>

                <Image source={config.images.backgroundTilePng} resizeMode='repeat' resizeMethod='scale' style={{position: 'absolute', width: config.screenWidth, height: config.screenWidth * 2}}/>
                <Video source={config.videos.countdownMp4} shouldPlay isLooping style={{position: 'absolute', opacity: .3, width: 250 + '%', height: 100 + '%'}} />

                <View style={{width: config.screenWidth, height: config.minimumHeaderHeight - 44}}/>

                <View style={{width: config.screenWidth, height: 120/900 * config.screenWidth + 29, flexDirection: 'row', alignItems: 'center'}}>
                    <LogoName style={{position: 'absolute'}}/>
                    <View style={{width: config.screenWidth * 2/5, position: 'absolute', right: 0}}><Text style={{fontSize: 20, textAlign: 'center', fontFamily: this.state.fontLoaded ? 'helvetica-bold' : null}}>has the app?</Text></View>
                </View>

                <FlatList
                    data={this.state.contacts}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <SingleContact contact={item} isFirstContact={this.state.contacts.indexOf(item) === 0} nav={this.navigateToSendMessageFromAddressBook.bind(this, item=item)} singleContactFont={{fontFamily: this.state.fontLoaded ? 'cinzel-regular' : null, fontSize: 20, paddingVertical: 15, paddingLeft: 15}}/>}
                    />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 100 + '%',
        height: 100 + '%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const stateToProps = state => {
    return {
        state: state
    }
}

const dispatchToProps = dispatch => {
    return {
        userReceived: (user) => dispatch(actions.userReceived(user))
    }
}

export default connect(stateToProps, dispatchToProps)(AddressBook)
