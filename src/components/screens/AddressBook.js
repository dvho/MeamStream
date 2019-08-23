import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { SingleContact } from '../views'
import actions from '../../redux/actions'
import config from '../../config'

//For AddressBook.js, need to render a Flatlist of this.props.state.user.contacts using SingleContact.js dumb components in TouchableOpacities, sending the contact property to each and an Object.assign({}, this.state.newMessage) setState function that will update this.state.newMessage with toUser and username from selected contact. Then set the initial state below to empty strings.

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
        this.navigateToSendMessageFromAddressBook = this.navigateToSendMessageFromAddressBook.bind(this)
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

    componentDidMount() {
        this.setState({
            contacts: this.props.state.account.user.contacts,
            profileImage:  this.props.state.account.user.profileImage,
            pushToken:  this.props.state.account.user.pushToken,
            showCreateMessage:  this.props.state.account.user.showCreateMessage,
            userId:  this.props.state.account.user.userId,
            username:  this.props.state.account.user.username
        })
    }

    render() {
        return(
            <View style={styles.container}>
                <Image source={config.images.backgroundTilePng} resizeMode='repeat' resizeMethod='scale' style={{position: 'absolute', width: config.screenWidth, height: config.screenWidth * 2}}/>

                <FlatList
                    data={this.props.state.account.user.contacts}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <SingleContact contact={item} nav={this.navigateToSendMessageFromAddressBook.bind(this, item=item)}/>}
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
