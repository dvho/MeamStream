import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Text, Animated, Easing } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TimeStamp } from './'
import config from '../../config'

//Important to note that, in rendering the message object here, StyleSheet.hairlineWidth actually renders differently according to device. I've estimated it at .5 px, thereby displacing the screen width by an extra 1px, but if it ends up causing a rendering problem on different devices I'll have to substitute it for a 1px width of a very light gray.

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
                                style={styles.profilePic}/> : <MaterialCommunityIcons name='tag-faces' size={40} color="rgb(250,84,33)" style={{transform: [{rotateY: '180deg'}]}}/> }

                            <Text style={styles.username}>{this.state.fromData.username}</Text>
                        </View>
                        <View style={styles.timeCol}>
                                <TimeStamp props={this.props.message.timestamp}/>
                        </View>
                    </View>
                    <View style={styles.bottomRow}>

                        {/*<Text style={styles.messageText}>{JSON.stringify(this.props.message)}</Text> */}
                        {/*This is where you'll build your renderer for the beautiful message object that gets sent over*/}
                        {/* Image width = config.screenWidth - 60, height = config.screenWidth - 60 * .7 */}
                        {this.props.message.giphyCanvasId !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyCanvasId}/200.gif`}} resizeMode='contain' resizeMethod='scale' style={{width: Math.round(config.screenWidth - 61), height: Math.round((config.screenWidth - 61) * .7), borderRadius: config.borderRadii}}></Image> : null}

                        {this.props.message.giphyPng1Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng1Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.round((config.screenWidth - 61) * .7 * this.props.message.giphyPng1Coords.y), left: Math.round((config.screenWidth - 61) * this.props.message.giphyPng1Coords.x), width: Math.round(config.screenWidth - 61 + 61/4)/4, height: Math.round((config.screenWidth - 61 + 61/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng2Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng2Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.round((config.screenWidth - 61) * .7 * this.props.message.giphyPng2Coords.y), left: Math.round((config.screenWidth - 61) * this.props.message.giphyPng2Coords.x), width: Math.round(config.screenWidth - 61 + 61/4)/4, height: Math.round((config.screenWidth - 61 + 61/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng3Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng3Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.round((config.screenWidth - 61) * .7 * this.props.message.giphyPng3Coords.y), left: Math.round((config.screenWidth - 61) * this.props.message.giphyPng3Coords.x), width: Math.round(config.screenWidth - 61 + 61/4)/4, height: Math.round((config.screenWidth - 61 + 61/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng4Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng4Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.round((config.screenWidth - 61) * .7 * this.props.message.giphyPng4Coords.y), left: Math.round((config.screenWidth - 61) * this.props.message.giphyPng4Coords.x), width: Math.round(config.screenWidth - 61 + 61/4)/4, height: Math.round((config.screenWidth - 61 + 61/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng5Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng5Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.round((config.screenWidth - 61) * .7 * this.props.message.giphyPng5Coords.y), left: Math.round((config.screenWidth - 61) * this.props.message.giphyPng5Coords.x), width: Math.round(config.screenWidth - 61 + 61/4)/4, height: Math.round((config.screenWidth - 61 + 61/4)/4)}}></Image> : null}

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
            borderRadius: config.borderRadii,
            borderColor: 'rgb(225, 225, 225)',
            backgroundColor: 'rgb(255, 255, 255)'
        },
        bottomRow: {
            flexDirection: 'row',
            marginTop: 20,
            backgroundColor: 'rgb(0,0,0)',
            borderRadius: config.borderRadii
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
        profilePic: {
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
