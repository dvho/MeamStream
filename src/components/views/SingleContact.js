import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

class SingleContact extends React.Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        return(
            <TouchableOpacity onPress={()=>this.props.nav(this.props.contact)} activeOpacity={0} key={this.props.contact.id}>
                <Text style={{fontSize: 20}}>{this.props.contact.name}</Text>
            </TouchableOpacity>
        )
    }
}

export default SingleContact
