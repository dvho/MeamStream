import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import config from '../../config'
import { AntDesign } from '@expo/vector-icons'

class SingleContact extends React.Component {
    constructor() {
        super()
        this.state = {
            hasApp: false,
            profileImage: ''
        }
    }

    async componentDidMount() {
        let username = this.props.contact.phoneNumbers[0].digits.split('').reverse().splice(0,10).reverse().join('')
        fetch(`${config.baseUrl}api/user/?username=${username}`, {
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
            if (responseJSON.data !== [] && responseJSON.data !== undefined) {
                this.setState({
                    hasApp: true,
                    profileImage: responseJSON.data[0].image
                })
            }
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    render() {

        return(
            <View>

                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-evenly', width: config.screenWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: config.colors.inactiveButton, borderTopWidth: this.props.isFirstContact ? StyleSheet.hairlineWidth : null}} onPress={()=>this.props.nav(this.props.contact)} activeOpacity={3} key={this.props.contact.id}>

                    <View style={{flex: 3, flexDirection: 'row', alignItems: 'center'}}>
                        { this.state.profileImage === '' ? null : <Image source={{uri: `${this.state.profileImage}=s${Math.floor(config.screenWidth/12)}-c`}} style={{width: 40, height: 40, borderRadius: 20, marginLeft: 10}}/> }
                        <Text style={this.props.singleContactFont}>{this.props.contact.name}</Text>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign name='closecircle' size={config.screenWidth/12} color={this.state.hasApp ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,1)'}/>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign name='checkcircle' size={config.screenWidth/12} color={!this.state.hasApp ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,1)'}/>
                    </View>

                </TouchableOpacity>

            </View>

        )
    }
}

export default SingleContact
