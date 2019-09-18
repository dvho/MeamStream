import React from 'react'
import { View, StyleSheet, Image, Text, Animated, Easing, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import * as Font from 'expo-font'
import Turbo from 'turbo360'
import { TimeStamp } from './'
import config from '../../config'
import actions from '../../redux/actions'

class MessageShort extends React.Component {

    constructor() {
        super()
        this.state = {
            fadeInAnim: new Animated.Value(0),
            fontLoaded: false,
            flaggedAndDeleted: false
        }
        this.turbo = Turbo({site_id: config.turboAppId})
    }


    flagAndFilterMessage() {
        this.props.filterMessage(this.props.message.id)
        this.setState({flaggedAndDeleted: true})
        Alert.alert(
             'Thanks for your feedback!',
            'Content will be removed next time you open the app.',
          [
            //{ text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
            { text: 'Close', onPress: () => console.log('Closed dialog box'), style: 'cancel'}
          ],
          { cancelable: false }
        )
        //this.turbo.removeEntity(`${config.baseUrl}api/message?id=${this.props.message.id}`)
    }

    alerting() {
        //console.log(this.props.filterArray)
        Alert.alert(
            'Heads up!',
            'Do you want to flag and remove this message?',
          [
            //{ text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
            { text: 'Cancel', onPress: () => console.log('Cancel remove content'), style: 'cancel'},
            { text: 'Yes', onPress: () => this.flagAndFilterMessage()},
          ],
          { cancelable: false }
        )
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

        return (
            <Animated.View style={{opacity: this.state.fadeInAnim}}>
                <View style={{width: config.screenWidth, marginTop: 15, marginBottom: 5, justifyContent: 'center', alignItems: 'center'}}><TimeStamp oneLineStamp={true} timestamp={this.props.message.timestamp} currentTimeInMilliseconds={this.props.state.account.user.currentTimeInMilliseconds} millisecondsSinceMidnight={this.props.state.account.user.millisecondsSinceMidnight} dateTimeFont={{fontSize: 14, fontFamily: this.state.fontLoaded ? 'cinzel-regular' : null}}/></View>

                <View style={containerStyle}>
                    <View style={styles.userCol}>

                        { profileImg !== '' ? <View style={styles.profilePicShadow}><Image
                            source={{uri: profileImg}}
                            style={styles.profile}/></View> : <MaterialCommunityIcons name='tag-faces' size={40} color={this.props.sentMessage ? 'rgb(250,84,33)' : 'rgb(0,85,255)'} style={this.props.sentMessage ? {transform: [{rotateY: '180deg'}]} : null}/> }

                    </View>

                    <TouchableOpacity style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 44, width: 40, height: 40, marginHorizontal: 10}} onPress={this.state.flaggedAndDeleted ? null : () => this.alerting()} activeOpacity={this.state.flaggedAndDeleted ? 1 : .3}><FontAwesome name={'flag'} size={26} color={this.state.flaggedAndDeleted ? 'rgb(255,0,0)' : 'rgb(200,200,200)'} /></TouchableOpacity>

                    { this.props.message.message !== '' ? <View style={[styles.message, {backgroundColor: 'rgb(255,255,255)', padding: 15}]}>
                        <Text style={{fontFamily: this.state.fontLoaded ? 'indieflower-regular' : null, fontSize: 22}}>{this.props.message.message}</Text>
                    </View>

                    :

                    <View style={[styles.message, {backgroundColor: 'rgb(0,0,0)'}]}>

                        {this.props.message.giphyMainId !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyMainId}/200.gif`}} resizeMode='contain' resizeMethod='scale' style={{width: Math.floor(config.screenWidth - 101), height: Math.floor((config.screenWidth - 101) * .7), borderRadius: config.borderRadii}}></Image> : <View style={{width: Math.floor(config.screenWidth - 101), height: Math.floor((config.screenWidth - 101) * .7), borderRadius: config.borderRadii, backgroundColor: 'rgb(0,0,0)'}}></View>}

                        {this.props.message.giphyPng1Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng1Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng1Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng1Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng2Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng2Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng2Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng2Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng3Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng3Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng3Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng3Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng4Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng4Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng4Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng4Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}

                        {this.props.message.giphyPng5Id !== '' ? <Image source={{uri: `https://media2.giphy.com/media/${this.props.message.giphyPng5Id}/100.gif`}} resizeMode='contain' resizeMethod='scale' style={{position: 'absolute', top: Math.floor((config.screenWidth - 102) * .7 * this.props.message.giphyPng5Coords.y), left: Math.floor((config.screenWidth - 102) * this.props.message.giphyPng5Coords.x), width: Math.floor(config.screenWidth - 101 + 101/4)/4, height: Math.floor((config.screenWidth - 101 + 101/4)/4)}}></Image> : null}



                        {this.props.message.words !== '' && this.props.message.wordsCoords.x !== -0.01 ? <Text style={{position: 'absolute', textAlign: 'center', color: 'rgb(243,243,243)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: (((config.screenWidth - 101)/10)- 4), top: Math.round((config.screenWidth - 101) * .7 * this.props.message.wordsCoords.y), left: Math.round((config.screenWidth - 101) * this.props.message.wordsCoords.x), fontFamily: this.state.fontLoaded ? 'abril-fatface-regular' : null}}>{this.props.message.words}</Text> : null}

                        {this.props.message.words !== '' && this.props.message.wordsCoords.x === -0.01 ? <View style={{position: 'absolute', width: 100 + '%', height: 100 + '%', justifyContent: 'center'}}><Text style={{textAlign: 'center', color: 'rgb(243,243,243)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: (((config.screenWidth - 101)/10)- 4), fontFamily: this.state.fontLoaded ? 'abril-fatface-regular' : null}}>{this.props.message.words}</Text></View> : null}

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
            paddingLeft: 10
        },
        message: {
            borderWidth: StyleSheet.hairlineWidth,
            marginHorizontal: 15,
            marginBottom: 15,
            borderRadius: config.borderRadii,
            borderColor: 'rgb(225, 225, 225)',
            backgroundColor: 'rgb(255, 255, 255)',
            shadowColor: 'rgb(0,0,0)',
            shadowOpacity: .7,
            shadowRadius: 5,
            shadowOffset: {width: 2, height: 2}
        },
        userCol: {
            flexDirection: 'row'
        },
        profile: {
            width: 40,
            height: 40,
            borderRadius: 20
        },
        profilePicShadow: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgb(255, 255, 255)',
            shadowColor: 'rgb(0,0,0)',
            shadowOpacity: .7,
            shadowRadius: 5,
            shadowOffset: {width: 2, height: 2}
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

export default connect(stateToProps, dispatchToProps)(MessageShort)
