import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, StatusBar, Modal, TouchableOpacity, TextInput } from 'react-native'
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

    //In both Message.js and Conversation.js (for the Conversation.js navbar) you want to run doesContactExist() from a common util function.

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
        this.setState({
            showCreateMessage: !this.state.showCreateMessage
        },
        () => {
            this.props.navigation.setParams({
                showIcon: !this.state.showCreateMessage
            })
        })
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
        console.log(this.props.state)
        //Need to get the profile image here as well, set it in state, and let that update in Redux below so that Profile.js has access to it

        await this.getContactsPermission()
        await this.setOrVerifyPushToken()

        let userId = await AsyncStorage.getItem(config.userIdKey)
        let token = await Notifications.getExpoPushTokenAsync()
        let contacts = await Contacts.getContactsAsync({
          fields: [
            Contacts.PHONE_NUMBERS
          ]
        })

        this.props.navigation.setParams({
            toggleCreateMessage: this.toggleCreateMessage,
            showIcon: !this.state.showCreateMessage
        })

        //the fetch below needs to be updated to handle a more dynamic route in the API which can also be used for updating the image. (i.e. put a type: pushToken object in the body

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
        await this.setState({userId: userId, pushToken: token, contacts: contacts.data, reduxStateUpdated: true})
        await this.props.userReceived(this.state)
    }

    render() {
        const messages = this.state.messages
        const lastIndex = messages.length - 1

        return(
            <View style={styles.container}>

            <Modal visible={this.state.showCreateMessage} transparent={true} animationType="fade" onRequestClose={this.cancel}>
                <SendMessage navProps={this.props.navigation} toggleCreateMessage={this.toggleCreateMessage}/>
            </Modal>

            <StatusBar barStyle='dark-content'/>
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

    }
}

const dispatchToProps = dispatch => {
    return {
        userReceived: (user) => dispatch(actions.userReceived(user))
    }
}

export default connect(stateToProps, dispatchToProps)(Home)
