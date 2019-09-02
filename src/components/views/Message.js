import React from 'react'
import { View, TouchableOpacity, StyleSheet, Image, Text, Animated, Easing } from 'react-native'
import { connect } from 'react-redux'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as Font from 'expo-font'
import { TimeStamp } from './'
import config from '../../config'
import actions from '../../redux/actions'

//Important to note that, in rendering the message object here, StyleSheet.hairlineWidth actually renders differently according to device. I've estimated it at .5 px, thereby displacing the screen width by an extra 1px, but if it ends up causing a rendering problem on different devices I'll have to substitute it for a 1px width of a very light gray.

class Message extends React.Component {
    constructor() {
        super()
        this.state = {
            fadeInAnim: new Animated.Value(0),
            fromData: {},
            contact: '',
            fontLoaded: false
        }
    }

    async doesContactExist() {
        const lastSevenDigitsUser = this.state.fromData.username.split('').reverse().splice(0,7).reverse().join('')
        this.props.state.account.user.contacts.forEach(i => {
            if (i.phoneNumbers !== undefined) {
                if (i.phoneNumbers[0].digits.split('').length >= 7) {
                    let lastSevenDigitsContact = i.phoneNumbers[0].digits.split('').reverse().splice(0,7).reverse().join('')
                    if (lastSevenDigitsUser === lastSevenDigitsContact) {
                        this.setState({
                            contact: i.name
                        })
                    }
                }
            }
        })
    }

    async componentDidMount() {
        await Font.loadAsync({
            'cinzel-regular': require('../../fonts/Cinzel-Regular.ttf'),
            'indieflower-regular': require('../../fonts/IndieFlower-Regular.ttf'),
            'abril-fatface-regular': require('../../fonts/AbrilFatface-Regular.ttf')
        })
        await this.setState({
            fontLoaded: true
        })

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

            this.doesContactExist()
            //console.log(this.props.state.account.user.contacts)

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

                            <Text style={[styles.username, {fontFamily: this.state.fontLoaded ? 'cinzel-regular' : null }]}>{this.state.contact !== '' ? this.state.contact : this.state.fromData.username}</Text>
                        </View>
                        <View style={styles.timeCol}>
                                <TimeStamp oneLineStamp={false} timestamp={this.props.message.timestamp} currentTimeInMilliseconds={this.props.state.account.user.currentTimeInMilliseconds} millisecondsSinceMidnight={this.props.state.account.user.millisecondsSinceMidnight} dateTimeFont={{fontSize: 10, fontFamily: this.state.fontLoaded ? 'cinzel-regular' : null}}/>
                        </View>
                    </View>


                    { this.props.message.message !== '' ? <View style={[styles.bottomRow, {backgroundColor: 'rgb(255,255,255)'}]}>
                        <Text style={{fontFamily: this.state.fontLoaded ? 'indieflower-regular' : null, fontSize: 22}}>{this.props.message.message}</Text>
                    </View>

                    :

                    <View style={[styles.bottomRow, {backgroundColor: 'rgb(0,0,0)'}]}>

                        {this.props.message.giphyMainId !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyMainId}/200.gif`}} resizeMode='contain' resizeMethod='scale' style={{width: Math.floor(config.screenWidth - 60), height: Math.floor((config.screenWidth - 60) * .7), borderRadius: config.borderRadii}}></Image> : <View style={{width: Math.floor(config.screenWidth - 60), height: Math.floor((config.screenWidth - 60) * .7), borderRadius: config.borderRadii, backgroundColor: 'rgb(0,0,0)'}}></View>}

                        {this.props.message.giphyPng1Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng1Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 60) * .7 * this.props.message.giphyPng1Coords.y), left: Math.floor((config.screenWidth - 60) * this.props.message.giphyPng1Coords.x), width: Math.floor(config.screenWidth - 60 + 60/4)/4, height: Math.floor((config.screenWidth - 60 + 60/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng2Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng2Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 60) * .7 * this.props.message.giphyPng2Coords.y), left: Math.floor((config.screenWidth - 60) * this.props.message.giphyPng2Coords.x), width: Math.floor(config.screenWidth - 60 + 60/4)/4, height: Math.floor((config.screenWidth - 60 + 60/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng3Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng3Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 60) * .7 * this.props.message.giphyPng3Coords.y), left: Math.floor((config.screenWidth - 60) * this.props.message.giphyPng3Coords.x), width: Math.floor(config.screenWidth - 60 + 60/4)/4, height: Math.floor((config.screenWidth - 60 + 60/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng4Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng4Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 60) * .7 * this.props.message.giphyPng4Coords.y), left: Math.floor((config.screenWidth - 60) * this.props.message.giphyPng4Coords.x), width: Math.floor(config.screenWidth - 60 + 60/4)/4, height: Math.floor((config.screenWidth - 60 + 60/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng5Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng5Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 60) * .7 * this.props.message.giphyPng5Coords.y), left: Math.floor((config.screenWidth - 60) * this.props.message.giphyPng5Coords.x), width: Math.floor(config.screenWidth - 60 + 60/4)/4, height: Math.floor((config.screenWidth - 60 + 60/4)/4)}}></Image> : null}



                        {this.props.message.words !== '' && this.props.message.wordsCoords.x !== -0.01 ? <Text style={{position: 'absolute', textAlign: 'center', color: 'rgb(243,243,243)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: (((config.screenWidth - 60)/10)- 4), top: Math.round((config.screenWidth - 60) * .7 * this.props.message.wordsCoords.y), left: Math.round((config.screenWidth - 60) * this.props.message.wordsCoords.x), fontFamily: this.state.fontLoaded ? 'abril-fatface-regular' : null}}>{this.props.message.words}</Text> : null}

                        {this.props.message.words !== '' && this.props.message.wordsCoords.x === -0.01 ? <View style={{position: 'absolute', width: 100 + '%', height: 100 + '%', justifyContent: 'center'}}><Text style={{textAlign: 'center', color: 'rgb(243,243,243)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: (((config.screenWidth - 60)/10)- 4), fontFamily: this.state.fontLoaded ? 'abril-fatface-regular' : null}}>{this.props.message.words}</Text></View> : null}

                    </View> }

                </TouchableOpacity>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({

        message: {
            borderWidth: StyleSheet.hairlineWidth, //This was borderTopWidth when we had no margin between each of the messages.
            marginHorizontal: 15,
            marginTop: 8,
            marginBottom: 8,
            padding: 15,
            borderRadius: config.borderRadii,
            borderColor: 'rgb(225, 225, 225)',
            backgroundColor: 'rgb(255, 255, 255)',
            shadowColor: 'rgb(0,0,0)',
            shadowOpacity: .35,
            shadowRadius: 5,
            shadowOffset: {width: 2, height: 2}
        },
        bottomRow: {
            flexDirection: 'row',
            marginTop: 20,
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

export default connect(stateToProps, dispatchToProps)(Message)
