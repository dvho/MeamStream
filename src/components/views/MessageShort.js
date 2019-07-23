import React from 'react'
import { View, StyleSheet, Image, Text, Animated, Easing } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

//Change this into a class based component in order to utilize react animations as in Message.js component

class MessageShort extends React.Component {

    constructor() {
        super()
        this.state = {
            fadeInAnim: new Animated.Value(0),
        }
    }

    componentDidMount() {
        Animated.timing(                // Animate over time
          this.state.fadeInAnim,       // The animated value to drive
          { toValue: 1,                 // Animate to opacity: 0
            duration: 1500,             // Make it take a 1500ms
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
          }).start()
    }

    render() {
        let profileImg = ''
        let dir = {}

        if (this.props.sentMessage) {
            profileImg = this.props.fromImage !== '' ? `${this.props.fromImage}=s40-c` : ''
            dir = { flexDirection: 'row' }
        } else {
            profileImg = this.props.toImage !== '' ? `${this.props.toImage}=s40-c` : ''
            dir = { flexDirection: 'row-reverse' }
        }

        const containerStyle = [styles.container, dir]
        //console.log(props.message.timestamp)

        return (
            <Animated.View style={{opacity: this.state.fadeInAnim}}>
                <View style={containerStyle}>
                    <View style={styles.userCol}>

                        { profileImg !== '' ? <Image
                            source={{uri: profileImg}}
                            style={styles.profile}/> : <MaterialCommunityIcons name='tag-faces' size={40} color={this.props.sentMessage ? 'rgb(250,84,33)' : 'rgb(0,85,255)'} style={this.props.sentMessage ? {transform: [{rotateY: '180deg'}]} : null}/> }

                    </View>
                    <View style={styles.message}>
                        <Text style={styles.messageText}>{this.props.message.message}</Text>
                    </View>
                </View>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({

        container: {
            width: 100 + '%',
            paddingRight: 40,
            paddingLeft: 10,
            marginTop: 15
        },
        message: {
            borderWidth: StyleSheet.hairlineWidth,
            marginHorizontal: 15,
            marginBottom: 15,
            padding: 15,
            borderRadius: 10,
            borderColor: 'rgb(225, 225, 225)',
            backgroundColor: 'rgb(255, 255, 255)'
        },
        userCol: {
            flexDirection: 'row'
        },
        profile: {
            width: 40,
            height: 40,
            borderRadius: 20
        },
        messageText:{
            fontSize: 14
        }
})

export default MessageShort
