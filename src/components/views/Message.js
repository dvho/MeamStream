import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Text, Animated, Easing } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TimeStamp } from './'
import config from '../../config'


class Message extends React.Component {
    constructor() {
        super()
        this.state = {
            fadeInAnim: new Animated.Value(0),
            fromData: {}
        }
    }

    componentDidMount() {
        const fromId = this.props.message.fromUser

        fetch(`${config.baseUrl}api/user/${fromId}`, {
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
            Animated.timing(                // Animate over time
              this.state.fadeInAnim,       // The animated value to drive
              { toValue: 1,                 // Animate to opacity: 0
                duration: 1500,             // Make it take a 1500ms
                easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
              }).start()
        })
        .catch(err => {
            alert('Sorry ' + err.message)
        })
    }

    render() {

        const senderImage = this.state.fromData.image !== '' ? `${this.state.fromData.image}=s40-c` : ''

        return(
            <Animated.View style={{opacity: this.state.fadeInAnim}}>
                <TouchableOpacity onPress={() => this.props.nav()} activeOpacity={.7} style={styles.message} key={this.props.message.id}>
                    <View style={styles.topRow}>
                        <View style={styles.userCol}>

                            { senderImage !== '' ? <Image
                                source={{uri: senderImage}}
                                style={styles.profile}/> : <MaterialCommunityIcons name='tag-faces' size={40} color="rgb(250,84,33)" style={{transform: [{rotateY: '180deg'}]}}/> }

                            <Text style={styles.username}>{this.state.fromData.username}</Text>
                        </View>
                        <View style={styles.timeCol}>
                                <TimeStamp props={this.props.message.timestamp}/>
                        </View>
                    </View>
                    <View style={styles.bottomRow}>
                        <Text style={styles.messageText}>{this.props.message.message}</Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({

        message: {
            borderWidth: StyleSheet.hairlineWidth, //This was borderTopWidth when we had no margin between each of the messages.
            marginHorizontal: 15,
            marginBottom: 15,
            padding: 15,
            borderRadius: 10,
            borderColor: 'rgb(225, 225, 225)',
            backgroundColor: 'rgb(255, 255, 255)'
        },
        bottomRow: {
            flexDirection: 'row',
            marginTop: 20
        },
        topRow: {
            flexDirection: 'row'
        },
        userCol: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
        },
        timeCol: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-end'
        },
        profile: {
            width: 40,
            height: 40,
            borderRadius: 20
        },
        username: {
            fontSize: 16,
            marginLeft: 8
        },
        date: {
            color: 'rgb(102, 102, 102)'
        },
        messageText:{
            fontSize: 14
        }
})

export default Message
