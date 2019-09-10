import React from 'react'
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Modal, Image, Platform } from 'react-native'
import { connect } from 'react-redux'
import { Entypo } from '@expo/vector-icons'
import * as Font from 'expo-font'
import { MessageShort, SendMessage } from '../views'
import config from '../../config'
import utils from '../../utils'
import actions from '../../redux/actions'

class Conversation extends React.Component {

    static navigationOptions = ({ navigation }) => {

        const params = navigation.state.params || {}
        return {
            title: params.currentConversation || null,
            headerStyle: {
                backgroundColor: config.colors.pastelGray
            },
            headerTitleStyle: {
                fontFamily: 'cinzel-regular'
            },
            // headerTintColor: config.colors.blue,
            // headerTitleStyle: {
            //     fontWeight: 'bold',
            //     color: 'rgb(0,0,0)',
            // },
            headerRight: params.showIcon ? (
                <TouchableOpacity onPress={params.toggleCreateMessage} activeOpacity={0.7} style={{paddingHorizontal: 20, paddingVertical: 10}}>
                    <Entypo name="new-message" size={config.screenWidth / 18} color={config.colors.blue}/>
                </TouchableOpacity>
            ) : null
        }
    }

    constructor() {
        super()
        this.state = {
            messages: [], //I was temporarily hardcoding these messages here until I had messages loaded onto the backend, at which point I set this to an empty array. Unfortunately, there's no longer a way to load dummy data into Turbo so the following is the dummy array I used here in addition to commenting out setState ({messages: responseJSON.data}) [{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Bob",message:"Hey call me!",dateTime:"2019-06-15T16:38:08.316Z", id:"1"},{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Bob",message:"Hellooo I said call me bro",dateTime:"2019-06-15T16:38:08.316Z", id:"2"},{toUser:"Tina",fromUser:"Jess",message:"NYC is fun!",dateTime:"2019-06-15T16:38:08.316Z", id:"3"},{toUser:"5d051e8569395e0014a8cbe2",fromUser:"Margerie",message:"We are so old!",dateTime:"2019-06-15T16:38:08.316Z", id:"4"}]
            allSortedMessages: [],
            page: 0,
            fromData: {},
            toData: {},
            showCreateMessage: false
        }
        this.toggleCreateMessage = this.toggleCreateMessage.bind(this)
        this.renderMessages = this.renderMessages.bind(this)
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

    renderMessages(sorted) {
        if ((this.state.messages.length === 0) || ((this.state.messages.length === 0) && (this.props.navigation.state.params.navFromHome === false))) {
            //console.log(this.state.messages.length)
            //console.log(this.props.navigation.state.params.navFromHome)
            //console.log(this.state.allSortedMessages)
            //console.log(this.state.messages)
            //console.log(sorted)
            let messages = this.state.messages
            messages.push(sorted[0])
            this.setState({
                allSortedMessages: sorted,
                messages: messages,
                showActivityIndictor: false
                })
                this.props.navigation.setParams({
                    navFromHome: true,
                    newMessage: undefined
                })
                //console.log(this.props.navigation.state.params.newMessage)
                //console.log(this.state.messages.length)
                //console.log(this.state.allSortedMessages.length)
        } else if ((this.props.navigation.state.params.newMessage === undefined) && (this.state.messages.length !== 0) && (this.state.messages.length !== this.state.allSortedMessages.length)) {
                //console.log(this.state.messages)
                let page = this.state.page + 1
                let messages = this.state.messages
                messages.push(this.state.allSortedMessages[page])
                this.setState({
                    messages: messages,
                    page: page
                })

        } else if (this.props.navigation.state.params.newMessage !== undefined && this.props.navigation.state.params.newMessage.id !== this.state.messages[0].id) {
            //console.log('unshift to the array from navigation')
            const newMessage = this.props.navigation.state.params.newMessage
            const messages = this.state.messages
            const allSortedMessages = this.state.allSortedMessages
            messages.unshift(newMessage)
            allSortedMessages.unshift(newMessage)

                this.setState({
                    messages: messages,
                    allSortedMessages: allSortedMessages,
                    showActivityIndictor: false,
                    })

                    this.props.navigation.setParams({
                        newMessage: undefined
                    })
        } else {
            return
        }
    }


    // Old renderMessages before pagination of Converation.js no matter from where it was navigated
    // renderMessages(sorted) {
    //     if (this.state.messages.length === 0) {
    //             this.setState({
    //                 messages: sorted, //I was temporarily commenting this out (hardcoding messages into state) so that state wasn't set with an empty array until I could get messages on the backend.
    //                 showActivityIndictor: false
    //             })
    //     } else if (this.props.navigation.state.params.newMessage !== undefined && this.props.navigation.state.params.newMessage.id !== this.state.messages[0].id) {
    //         const newMessage = this.props.navigation.state.params.newMessage
    //         const messages = this.state.messages
    //         messages.unshift(newMessage)
    //             this.setState({
    //                 messages: messages,
    //                 showActivityIndictor: false,
    //                 })
    //     } else {
    //         return
    //     }
    // }


    async componentDidMount() {
        await Font.loadAsync({
            'cinzel-regular': require('../../fonts/Cinzel-Regular.ttf'),
        })
        this.props.navigation.setParams({
            toggleCreateMessage: this.toggleCreateMessage,
            showIcon: !this.state.showCreateMessage,
        })

        const fromId = this.props.navigation.state.params.user
        const toId = this.props.navigation.state.params.me

        await fetch(`${config.baseUrl}api/user/${fromId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(response => {
            return response.json()
        })
        .then(responseJSON => {
            this.setState({
                fromData: responseJSON.data
            })
        })
        .catch(err => {
            alert('Sorry ' + err.message)
        })

        await fetch(`${config.baseUrl}api/user/${toId}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json'
            }
        })
        .then(response => {
            return response.json()
        })
        .then(responseJSON => {
            this.setState({
                toData: responseJSON.data
            })
        })
        .catch(err => {
            alert('Sorry ' + err.message)
        })

        //Unable to put the below shared method (refered to as "doesContactExist" in Message.js) in utils because it doesn't properly return a single value when arguments are passed to it.

        let currentConversation = this.state.fromData.username
        let lastTenDigitsUser = this.state.fromData.username.split('').reverse().splice(0,10).reverse().join('')

        if (Platform.OS === 'ios') {

            this.props.state.account.user.contacts.forEach(i => {
                if (i.phoneNumbers !== undefined) {
                    if (i.phoneNumbers[0].digits.split('').length >= 10) {
                        let lastTenDigitsContact = i.phoneNumbers[0].digits.split('').reverse().splice(0,10).reverse().join('')
                        if (lastTenDigitsUser === lastTenDigitsContact) {
                            currentConversation = i.name
                        }
                    }
                }
            })
        } else {
            this.props.state.account.user.contacts.forEach(i => {
                if (i.phoneNumbers !== undefined) {
                    let phoneNumber
                    i.phoneNumbers.map(j => {
                        if (j.isPrimary === 1) {
                            phoneNumber = j.number
                        }
                    })
                    if (phoneNumber !== undefined) {
                        if (phoneNumber.split('').length >= 10) {

                            let lastTenDigitsContact = phoneNumber.split('').reverse().splice(0,10).reverse().join('')

                            if (lastTenDigitsUser === lastTenDigitsContact) {
                                currentConversation = i.name
                            }
                        }
                    }
                }
            })
        }

        this.props.navigation.setParams({
            currentConversation: currentConversation
        })

        utils
        .fetchMessages('message/me', { fromUser: fromId })
        .then(responseJSON => {
            const sorted = utils.sortMessagesByDate(responseJSON.data)
            this.renderMessages(sorted)
        })
        .catch(err => {
            console.log(err.message)
            this.setState({
                showActivityIndictor: false
            })
        })
    }

    render() {

        return (

            <View style={styles.container}>

            <Modal visible={this.state.showCreateMessage} transparent={true} animationType="fade" onRequestClose={this.cancel} onDismiss={this.renderMessages}>
                <SendMessage toUserName={this.props.navigation.state.params.currentConversation} toUser={this.state.fromData.username} navProps={this.props.navigation} toggleCreateMessage={this.toggleCreateMessage}/>
            </Modal>

            <Image source={config.images.backgroundTilePng} resizeMode='repeat' style={{position: 'absolute', width: config.screenWidth, height: config.screenWidth * 2}}/>

            <FlatList
                onEndReached={this.renderMessages}
                onEndReachedThreshold={.9}
                data={this.state.messages}
                extraData={this.state}
                keyExtractor={item => item.id}
                renderItem={({item}) => <MessageShort toImage={this.state.toData.image} fromImage={this.state.fromData.image} sentMessage={item.fromUser === this.props.navigation.state.params.user} message={item}/>}
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
    }
})

const stateToProps = state => {
    return {
        state: state
    }
}

const dispatchToProps = dispatch => {
    return {

    }
}

export default connect(stateToProps, dispatchToProps)(Conversation)
