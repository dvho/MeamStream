import React from 'react'
import { View, StyleSheet, Image, Text, Animated, Easing } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import config from '../../config'

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



                    { this.props.message.message !== '' ? <View style={[styles.message, {backgroundColor: 'rgb(255,255,255)', padding: 15}]}>
                        <Text style={styles.messageText}>{this.props.message.message}</Text>
                    </View>

                    :

                    <View style={[styles.message, {backgroundColor: 'rgb(0,0,0)'}]}>

                        {this.props.message.giphyMainId !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyMainId}/200.gif`}} resizeMode='contain' resizeMethod='scale' style={{width: Math.floor(config.screenWidth - 101), height: Math.floor((config.screenWidth - 101) * .7), borderRadius: config.borderRadii}}></Image> : <View style={{width: Math.floor(config.screenWidth - 101), height: Math.floor((config.screenWidth - 101) * .7), borderRadius: config.borderRadii, backgroundColor: 'rgb(0,0,0)'}}></View>}

                        {this.props.message.giphyPng1Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng1Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng1Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng1Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng2Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng2Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng2Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng2Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng3Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng3Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng3Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng3Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng4Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng4Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng4Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng4Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng5Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng5Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng5Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng5Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}



                        {this.props.message.words !== '' && this.props.message.wordsCoords.x !== -0.01 ? <Text style={{position: 'absolute', textAlign: 'center', color: 'rgb(215,215,215)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: (((config.screenWidth - 101)/10)- 4), top: Math.round((config.screenWidth - 101) * .7 * this.props.message.wordsCoords.y), left: Math.round((config.screenWidth - 101) * this.props.message.wordsCoords.x), fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.message.words}</Text> : null}

                        {this.props.message.words !== '' && this.props.message.wordsCoords.x === -0.01 ? <View style={{position: 'absolute', width: 100 + '%', height: 100 + '%', justifyContent: 'center'}}><Text style={{textAlign: 'center', color: 'rgb(215,215,215)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: (((config.screenWidth - 101)/10)- 4), fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.message.words}</Text></View> : null}

                    </View> }


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
            borderRadius: config.borderRadii,
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
