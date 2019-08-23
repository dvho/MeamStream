import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, Modal, TouchableOpacity, TextInput, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import * as Contacts from 'expo-contacts'
import { Message, SendMessage, LogoName } from '../views'
import utils from '../../utils'
import config from '../../config'
import actions from '../../redux/actions'

//Push notifications https://www.youtube.com/watch?v=-2zoM_QWGY0

class Home extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {}
        return {
            headerLeft: <LogoName/>,
            headerStyle: {
                backgroundColor: config.colors.pastelGray,
                height: 120/900 * config.screenWidth + 30
            },
            //headerTintColor: config.colors.blue,
            // headerTitleStyle: {
            //     fontWeight: 'bold',
            //     color: 'rgb(0,0,0)',
            // },
            headerRight: params.showIcon ? (
                <TouchableOpacity onPress={params.toggleCreateMessage} activeOpacity={0.7} style={{paddingHorizontal: 22, paddingVertical: 10}}>
                    <Entypo name="new-message" size={config.screenWidth / 16} color={config.colors.blue}/>
                </TouchableOpacity>
            ) : null
        }
    }

    constructor() {
        super()
        this.state = {
            reduxStateUpdated: false,
            userId: '',
            username: '',
            profileImage: '',
            pushToken: '',
            contacts: [],
            showActivityIndictor: false,
            fetchingPage: false,
            showCreateMessage: false,
            messages: [], //I was temporarily hardcoding these messages here until I had messages loaded onto the backend, at which point I set this to an empty array. Unfortunately, there's no longer a way to load dummy data into Turbo so the following is the dummy array I used here in addition to commenting out setState ({messages: responseJSON.data}) [{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Bob",message:"Hey call me!",dateTime:"2019-06-15T16:38:08.316Z", id:"1"},{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Bob",message:"Hellooo I said call me bro",dateTime:"2019-06-15T16:38:08.316Z", id:"2"},{toUser:"Tina",fromUser:"Jess",message:"NYC is fun!",dateTime:"2019-06-15T16:38:08.316Z", id:"3"},{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Margerie",message:"We are so old!",dateTime:"2019-06-15T16:38:08.316Z", id:"4"}]
            // newMessage: {
            //     toUser: '',
            //     message: ''
            // },
            lastSuccessfullyFetchedPage: 0,
        }
        this.toggleCreateMessage = this.toggleCreateMessage.bind(this)
        this.fetchMessages = this.fetchMessages.bind(this)
        this.fetchUserData = this.fetchUserData.bind(this)
        this.setOrVerifyPushToken = this.setOrVerifyPushToken.bind(this)
    }
    //In both Message.js and Conversation.js (for the Conversation.js navbar) it would've been nice to run doesContactExist() from a common util function but it didn't work passing params to it.

    async getContactsPermission() {
        const { status } = await Permissions.askAsync(Permissions.CONTACTS)
        if (status !== 'granted') {
          alert('Ok, MemeStream won\'t be able to display your friends\' names, hope ya don\'t mind.')
          return
        }
    }

    async setOrVerifyPushToken() {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
        let finalStatus = existingStatus
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
            finalStatus = status
        }
        if (finalStatus !== 'granted') {
            return
        }
    }

    toggleCreateMessage() {
        //There's a bug around here where I have to hit cancel twice to get out of sending a message if I've navigated to SendMessage from AddressBook
        this.setState({
            showCreateMessage: !this.state.showCreateMessage
        })
        //this.props.userReceived(this.state)

            this.props.navigation.setParams({
                showIcon: !this.state.showCreateMessage
            })

        this.props.userReceived(this.state)
    }

    async fetchUserData(userId) {
        fetch(`${config.baseUrl}api/user/${userId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(response => {
            return(response.json())
        })
        .then(responseJSON => {
            this.setState({
                username: responseJSON.data.username,
                profileImage: responseJSON.data.image
            })
        })
        .then(() => {
            this.props.userReceived(this.state)
        })
        .catch(err => {
            this.setState({
                userExists: undefined
            })
        })
    }

    fetchMessages() {
        if (this.state.fetchingPage || this.state.endReached) {
            return
        }
        const page = this.state.lastSuccessfullyFetchedPage + 1
        this.setState({
            fetchingPage: true
        })
        utils.fetchMessages('message', {page: page})
            .then(responseJSON => {
                const sorted = utils.sortMessagesByDate(responseJSON.data)
                let newMessages = Object.assign([], this.state.messages)
                sorted.forEach((message, i) => {
                    newMessages.push(message)
                })
                const endReached = sorted.length === 0
                this.setState({
                    lastSuccessfullyFetchedPage: page,
                    messages: newMessages, //I was temporarily commenting this out (so that state wasn't set with an empty array) until I could get messages on the backend.
                    showActivityIndictor: false,
                    fetchingPage: false,
                    endReached: endReached
                })
            })
            .catch(err => {
                console.log(err.message)
                this.setState({
                    showActivityIndictor: false
                })
            })
    }
    // navigateToConversationFromSentMessage(data) {
    //     console.log('calling from home')
    //     this.props.navigation.navigate('conversation', {me: data.fromUser, user: data.toUser, newMessage: data})
    // }

    async navigateToConversationFromReadingMessages(data) {
        if (!this.state.reduxStateUpdated) {
            return
        }
        await this.props.navigation.navigate('conversation', {me: data.toUser, user: data.fromUser, contacts: this.state.contacts})
    }

    updateNewMessage(text, field) {
        let newMessage = Object.assign({}, this.state.newMessage)
        newMessage[field] = text
        this.setState({
            newMessage: newMessage
        })
    }

    async componentDidMount() {
        //Need to get the profile image here as well, set it in state, and let that update in Redux below so that Profile.js has access to it
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            StatusBar.setBarStyle('dark-content')
        })

        await this.getContactsPermission()
        await this.setOrVerifyPushToken()

        let userId = await AsyncStorage.getItem(config.userIdKey)
        let token = await Notifications.getExpoPushTokenAsync()
        let contacts = await Contacts.getContactsAsync({
          fields: [
            Contacts.PHONE_NUMBERS
          ]
        })
        const cleanedContacts = []
        contacts.data.forEach(i => { //Siri automatially generates a contact for the phone itself which lacks a phoneNumbers array in the contacts.data object, however, displays the phone's own number when looking at the contact in the address book of the phone... very confusing so in case you're wondering why your app is crashing with a " "'0' is undefined" error even after buffering for it in a conditional statement check to see if Siri is the culprit. This forEach checks to make sure Siri won't crash the app
            if (i.phoneNumbers !== undefined) {
                cleanedContacts.push(i)
            }
            return cleanedContacts
        })

        this.props.navigation.setParams({
            toggleCreateMessage: this.toggleCreateMessage,
            showIcon: !this.state.showCreateMessage
        })

        try {
            // Each user who permits push notifications gets their unique token posted to the server under their User id so that it can be retrieved when a push notification is sent. I created a new route in the API for this that uses Turbo360's turbo.updateEntity method.
            fetch(`${config.baseUrl}api/updateuser`, {
            method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    },
                body: JSON.stringify({
                    type: 'pushToken',
                    token: {
                        value: token,
                    },
                    user: {
                        id: userId,
                    }
                })
            })
        }
        catch(err) {
            console.log(err)
        }
        await this.fetchMessages()
        await this.fetchUserData(userId)
        await this.setState({userId: userId, pushToken: token, contacts: cleanedContacts, reduxStateUpdated: true})
        await this.props.userReceived(this.state)
    }

    componentWillUnmount() {
        this._navListener.remove()
    }

    render() {

        const messages = this.state.messages
        const lastIndex = messages.length - 1

        return(
            <View style={styles.container}>

            <Modal visible={this.props.state.account.user === undefined ? false : this.props.state.account.user.showCreateMessage} transparent={true} animationType="fade" onRequestClose={this.cancel}>
                <SendMessage navProps={this.props.navigation} toggleCreateMessage={this.toggleCreateMessage}/>
            </Modal>

                {(this.state.showActivityIndictor) ? <ActivityIndicator style={{width: 100 + '%', height: 100 + '%'}} animating size='large'/> : null }

                <FlatList
                    onEndReached={this.fetchMessages}
                    onEndReachedThreshold={.5}
                    data={utils.mostRecentMessagePerSender(this.state.messages)}
                    ListFooterComponent={() => (this.state.fetchingPage) ? <ActivityIndicator/> : null}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <Message message={item} nav={this.navigateToConversationFromReadingMessages.bind(this, item=item)}/>}
                    />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 100 + '%',
        height: 100 + '%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgb(243, 243, 243)',
        flex: 1
    },
    to: {
        fontSize: 24,
        height: 100 + '%',
        alignSelf: 'center',
        color: 'rgb(64,64,64)',
        padding: 10
    },
    toInput: {
        width: 100 + '%',
        height: 60,
        backgroundColor: 'rgb(255,255,255)',
        fontSize: 36
    },
    messageInput: {
        width: 100 + '%',
        height: 120,
        backgroundColor: 'rgb(255,255,255)',
        fontSize: 16
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgb(162,55,243)',
        borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'rgb(213,211,200)'
    },
    buttonText: {
        fontSize: 24
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

export default connect(stateToProps, dispatchToProps)(Home)
