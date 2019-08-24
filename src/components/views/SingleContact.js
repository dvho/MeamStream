import React from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import config from '../../config'
import { AntDesign } from '@expo/vector-icons'

class SingleContact extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        console.log(this.props.hasMemeStreamAndPhoto)
        return(
            <View>

                <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-evenly', width: config.screenWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#ccc', borderTopWidth: this.props.isFirstContact ? StyleSheet.hairlineWidth : null}} onPress={()=>this.props.nav(this.props.contact)} activeOpacity={0} key={this.props.contact.id}>

                    <View style={{flex: 3, padding: 10}}>
                        <Text style={{fontSize: 20}}>{this.props.contact.name}</Text>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign name='closecircle' size={config.screenWidth/12}/>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <AntDesign name='checkcircle' size={config.screenWidth/12}/>
                    </View>

                </TouchableOpacity>

            </View>

        )
    }
}

export default SingleContact
