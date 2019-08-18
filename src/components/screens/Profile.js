import React from 'react'
import { View, Text, StyleSheet, AsyncStorage, StatusBar, TouchableOpacity, Image, Animated, Easing, ImageEditor} from 'react-native'
import { connect } from 'react-redux'
import config from '../../config'
import Turbo from 'turbo360'
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons'
import { Video } from 'expo-av'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import actions from '../../redux/actions'

class Profile extends React.Component {
    constructor() {
        super()
        this.state = {
            drawLeftCurtain: new Animated.Value(0),
            drawRightCurtain: new Animated.Value(0),
            fadeOutVeil: new Animated.Value(1),
            fadeInScreen: new Animated.Value(0),
            fadeInInterface: new Animated.Value(0),
            //fadeInProfilePic: new Animated.Value(0),
            selfieIconHue: 0,
            logoutIconHue: 180,
            intervalId: null,
            imageProcessingStatus: '',
            profileImage: '',
            showImagePicker: false,
            selectedImage: null
        }
        this.turbo = Turbo({site_id: config.turboAppId}) //better than putting it in state because we're no watching for any changes on it, it's static - setting a class variable as such for cases like these is best practice
        this.toggleSelectImage = this.toggleSelectImage.bind(this)
        this.selectImage = this.selectImage.bind(this)
        this.startHueIncrement = this.startHueIncrement.bind(this)
    }

    logout() {
        AsyncStorage.removeItem(config.userIdKey)
        .then(removed => {
            this.props.navigation.navigate('auth')
        })
    }

    updateProfilePic(image) {
        //In addition to setting this in state (and displaying it in place of the old image / video placeholder) need to update the user's account with the image with fetch, so you'll already need to have profile info from Redux and an API route that uses turbo.updateEntity to handle it. The image isn't in the Redux state at this point so you'll have to fetch it on componentDidMount. Once the image is updated you'll have to update it in Redux as well in the event the user updated their pic and then navigated away from Profile and back again, otherwise they'll just keep seeing the pre-updated image.
        this.setState({
            selectedImage: image,
            showImagePicker: !this.state.showImagePicker
        })
        console.log(image)
    }

    getCameraRollPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status !== 'granted') {
          alert('No problem! You can set a profile picture later.')
          return
        }
      }
    }

    selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [.766,1],
        })

        if (result.cancelled) {
            this.setState({
                showImagePicker: !this.state.showImagePicker
            })
            return
        }

            this.setState({
                imageProcessingStatus: 'Processing Image...'
            })

            const file = {
                uri: result.uri,
                name: 'new_image',
                type: 'image/jpeg'
            }
            const apiKey = '7374b9b8-bf47-4b6c-bc1f-7a76b939aecb'
            const cdnResp = await this.turbo.uploadFile(file, apiKey)

            this.setState({
                imageProcessingStatus: ''
            })
        this.updateProfilePic(cdnResp.result.url)
    }

    startHueIncrement() {
            this.setState({
                selfieIconHue: (this.state.selfieIconHue + 1) % 360,
                logoutIconHue: (this.state.logoutIconHue + 1) % 360,
            })
    }

    toggleSelectImage() {
        this.setState({
            showImagePicker: !this.state.showImagePicker
        })
        setTimeout(() => {
            if (this.state.showImagePicker) {
            this.selectImage()
            }
        }, 1)
    }

    componentDidMount() {
        console.log(this.props.state.account.user)
        this.getCameraRollPermissionAsync()
        const intervalId = setInterval(this.startHueIncrement, 2)
        this.setState({intervalId: intervalId})
        Animated.timing(
            this.state.fadeInScreen,
            { toValue: 1,
            delay: 500,
            duration: 500,
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
            }).start()
        Animated.timing(
            this.state.drawLeftCurtain,
            { toValue: -config.screenWidth * .75,
            delay: 1500,
            duration: 2500,
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
            }).start()
        Animated.timing(
            this.state.drawRightCurtain,
            { toValue: -config.screenWidth * .75,
            delay: 1500,
            duration: 2500,
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
            }).start()
        Animated.timing(                // Animate over time
            this.state.fadeOutVeil,     // The animated value to drive
            { toValue: 0,               // Animate to opacity: 0
            delay: 2000,                // Wait for curtains
            duration: 3000,             // Make it take a 2000ms
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
            }).start()
        Animated.timing(                // Animate over time
            this.state.fadeInInterface, // The animated value to drive
            { toValue: 1,               // Animate to opacity: 1
            delay: 2000,                // Wait for curtains
            duration: 4000,             // Make it take a 3000ms
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
            }).start()
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId)
    }

    render() {

        let selectedImage = this.state.selectedImage

        return(
            <Animated.View style={[styles.container, {opacity: this.state.fadeInScreen}]}>

                {/* <StatusBar barStyle='light-content'/> //There's an issue here that light-content is not going back to dark-content when navigating back to Home.js, need to search that */}

                <View style={{position: 'absolute', backgroundColor: 'rgb(255,255,255)', width: config.screenWidth, height: config.screenWidth}}></View>

                <Video source={config.videos.countdownMp4} shouldPlay isLooping style={{position: 'absolute', top: Math.round(config.screenWidth * .15), opacity: .4, width: Math.round(config.screenWidth * .75), height: Math.round(config.screenWidth * .6)}} />

                <Animated.View style={{opacity: this.state.fadeInProfilePic, position: 'absolute', top: Math.round(config.screenWidth * .16667)}}><Image source={{uri: this.state.profileImage !== '' ? this.state.profileImage : null}} style={{width: Math.round(config.screenWidth * .75), height: Math.round(config.screenWidth * .58333)}}/></Animated.View>

                <Image source={config.images.theaterPng} style={{position: 'absolute', width: config.screenWidth, height: Math.round(config.screenWidth * 1.58333)}}/>

                <Text style={[{position: 'absolute', top: Math.round(config.screenWidth * .39), left: Math.round(config.screenWidth * .17), fontSize: 14, fontWeight: 'bold', color: `'hsl(${this.state.selfieIconHue}, 75%, 25%)'`}, styles.leftIconShadow]}>{this.state.imageProcessingStatus}</Text>

                <Animated.View style={{opacity: this.state.fadeOutVeil, position: 'absolute', width: config.screenWidth, height: config.screenWidth * 2, backgroundColor: 'rgb(0,0,0)'}}/>

                <Animated.View style={{opacity: this.state.fadeInInterface}}>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: Math.round(config.screenWidth * .16667), padding: 8}}>
                        <TouchableOpacity onPress={() => this.toggleSelectImage()} activeOpacity={0.1} style={{paddingVertical: 15, paddingHorizontal: 2}}>
                            <MaterialCommunityIcons name="tag-faces" size={45} color={`'hsl(${this.state.selfieIconHue}, 75%, 25%)'`} style={[{paddingVertical: 4}, styles.leftIconShadow]}/>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.logout()} activeOpacity={0.1} style={{padding: 15, flexDirection: 'row', alignItems: 'center'}}>
                            <Entypo name="log-out" size={45} color={`'hsl(${this.state.logoutIconHue}, 75%, 25%)'`} style={[{paddingVertical: 4}, styles.leftIconShadow]}/>
                        </TouchableOpacity>
                    </View>

                </Animated.View>

                <Animated.View style={{position: 'absolute', left: this.state.drawLeftCurtain}}>
                    <Image source={config.images.curtainPng} style={{width: config.screenWidth * .75, height: config.screenWidth * .75 * (33/17)}}/>
                </Animated.View>

                <Animated.View style={{position: 'absolute', right: this.state.drawRightCurtain}}>
                    <Image source={config.images.curtainPng} style={{transform: [{rotateY: '180deg'}], width: config.screenWidth * .75, height: config.screenWidth * .75 * (33/17)}}/>
                </Animated.View>

            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(0,0,0)',
        width: 100 + '%',
        height: 100 + '%',
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    leftIconShadow: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .6,
        shadowRadius: 2,
        shadowOffset: {width: -10, height: 12}
    },
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

export default connect(stateToProps, dispatchToProps)(Profile)
