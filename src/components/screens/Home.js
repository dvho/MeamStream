import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage, FlatList, StatusBar, Modal, TouchableOpacity, TextInput } from 'react-native'
import { Entypo } from '@expo/vector-icons'
import { Message, SendMessage } from '../views'
import utils from '../../utils'
import config from '../../config'

class Home extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {}
        //console.log(params)
        return {
            title: 'Messages',
            headerStyle: {
                backgroundColor: config.colors.main
            },
            headerTintColor: 'rgb(255,255,255)',
            headerTitleStyle: {
                fontWeight: 'bold',
                color: 'rgb(255,255,255)',
            },
            headerRight: params.showIcon ? (
                <TouchableOpacity onPress={params.toggleCreateMessage} activeOpacity={0.7} style={{paddingHorizontal: 20, paddingVertical: 10}}>
                    <Entypo name="new-message" size={config.screenWidth / 18} color="rgb(255,255,255)"/>
                </TouchableOpacity>
            ) : null
        }
    }

    constructor() {
        super()
        this.state = {
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
                    messages: newMessages, //temporarily commenting this out so that state isn't set with an empty array until I can get messages on the backend
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

    navigateToConversationFromSentMessage(data) {
        this.props.navigation.navigate('conversation', {me: data.fromUser, user: data.toUser})
    }
    navigateToConversationFromReadingMessages(data) {
        this.props.navigation.navigate('conversation', {me: data.toUser, user: data.fromUser})
    }

    updateNewMessage(text, field) {
        let newMessage = Object.assign({}, this.state.newMessage)
        newMessage[field] = text
        this.setState({
            newMessage: newMessage
        })
    }

    componentDidMount() {
        this.props.navigation.setParams({
            toggleCreateMessage: this.toggleCreateMessage,
            showIcon: !this.state.showCreateMessage
        })
        this.fetchMessages()
    }

    render() {
        const messages = this.state.messages
        const lastIndex = messages.length - 1

        return(
            <View style={styles.container}>

            <Modal visible={this.state.showCreateMessage} transparent={true} animationType="fade" onRequestClose={this.cancel}>
                <SendMessage navProps={this.props.navigation} toggleCreateMessage={this.toggleCreateMessage} navigateToConversationFromSentMessage={this.navigateToConversationFromSentMessage}/>
            </Modal>

            <StatusBar barStyle='light-content'/>
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

export default Home
