import React from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TextInput, AsyncStorage, StatusBar,TouchableOpacity, Keyboard, Image, Animated, Easing, ImageEditor} from 'react-native'
import config from '../../config'
import Turbo from 'turbo360'
import { Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { Video } from 'expo-av'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
//Need https://www.npmjs.com/package/react-phone-number-input

//I know I can pass logged in profile data through this.props.navigation.navigate but I have to work on it. First trial run I overlooked that these params effectively bypass Home if one is already logged in upon opening the app

class Authenticate extends React.Component {
    constructor() {
        super()
        this.state = {
            enterTheater: false,
            drawLeftCurtain: new Animated.Value(0),
            drawRightCurtain: new Animated.Value(0),
            fadeOutVeil: new Animated.Value(1),
            fadeInScreen: new Animated.Value(0),
            fadeOutScreen: new Animated.Value(1),
            fadeInInterface: new Animated.Value(0),
            fadeInProfilePic: new Animated.Value(0),
            selfieIconHue: 0,
            intervalId: null,
            imageProcessingStatus: '',
            profileImage: '',
            showImagePicker: false,
            selectedImage: null,
            loginScreen: true,
            loginStatus: '   Enter   ',
            loginHand: 'hand',
            loginColor: config.colors.inactiveButton,
            textColor: 'rgb(96,96,96)',
            handSize: 48,
            credentials: {
                username: '',
                password: '',
                //image: ''   For some reason it actually doesn't need username nor password listed in state in order to properly validate users. including image, however, makes the callback url from the CDN part of the validation criteria hence no one would be able to access their accounts. Also for some reason the image is properly linking to the new profiles once new profile is submitted with this.turbo.createUser(cred).
            },
            userExists: undefined
        }
        this.turbo = Turbo({site_id: config.turboAppId}) //better than putting it in state because we're no watching for any changes on it, it's static - setting a class variable as such for cases like these is best practice
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
        this.submit = this.submit.bind(this)
        this.timerSuccess = this.timerSuccess.bind(this)
        this.timerFail = this.timerFail.bind(this)
        this.toggleSelectImage = this.toggleSelectImage.bind(this)
        this.selectImage = this.selectImage.bind(this)
        this.startHueIncrement = this.startHueIncrement.bind(this)
    }

    updateCredentials(text, field) {
        let credentials = Object.assign({}, this.state.credentials)
        credentials[field] = text
        this.setState({
            credentials: credentials
        })
    }

    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
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

        //Now send the local image to turbo CDN, get a callback function, pick off the new URL from the CDN and add it to credentials when turbo runs this.turbo.createUser. Whatever that new url is should be substituded for result.uri below.
        this.updateCredentials(cdnResp.result.url, 'image')

        this.setState({
            selectedImage: result.uri,
            showImagePicker: !this.state.showImagePicker
        })
    }

    startHueIncrement() {
            this.setState({
                selfieIconHue: (this.state.selfieIconHue + 1) % 360
            })
    }

    togglePage() {
        this.setState({
            loginScreen: !this.state.loginScreen
        })
        if (this.state.loginScreen) {
            const intervalId = setInterval(this.startHueIncrement, 2)
            this.setState({intervalId: intervalId})
        } else {
            clearInterval(this.state.intervalId)
        }
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

    timerSuccess() {
        this.setState({
            enterTheater: false
        })
        Animated.timing(                // Animate over time
          this.state.fadeOutScreen,     // The animated value to drive
          { toValue: 0,                 // Animate to opacity: 0
            delay: 1000,                // Wait 1000ms (so users can see the thumbs up)
            duration: 1500,             // Make it take 1500ms
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
          }).start()
        Animated.timing(                // Animate over time
          this.state.fadeInProfilePic,  // The animated value to drive
          { toValue: 1,                 // Animate to opacity: 1
            duration: 2500,             // Make it take 2500ms
            easing: Easing.bezier(0.15, 0.45, 0.45, 0.85)
          }).start()

        setTimeout(() => {              // Wait 2500ms to navigate to Home otherwise you won't see the 1000ms delay on the thumbs up and the 1500ms animation
            this.props.navigation.navigate('home')
        }, 2500)
    }

    timerFail() {
        setTimeout(() => {
            this.setState({
                loginHand: 'hand',
                loginStatus: '   Enter   ',
                loginColor: config.colors.inactiveButton,
                textColor: 'rgb(96,96,96)'
            })
        }, 1500)
    }

    async submit() {

            await fetch(`${config.baseUrl}api/user?username=${this.state.credentials.username}`, {
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
                this.setState({
                    userExists: responseJSON.data[0].username,
                    profileImage: responseJSON.data[0].image
                })
            })
            .catch(err => {
                this.setState({
                    userExists: undefined
                })
            })

        //(Here if this.state.loginScreen is false (if you're about to run the register function) you need to first check if the user already exists. Why does turbo360 SDK not already do that with their createUser function? You'll need to create a route in the API that handles this.) Also, if it's a new user using register, this.turbo.createUser(cred), once they're in, before the return function, call turbo.updateEntity to update the record with the image. Make sure that the profile image updloaded is outside the credentials object...update: somehow this last part automatially worked... why?
        const authFunction = this.state.loginScreen ? this.login : this.register
        authFunction(this.state.credentials)
            .then(resp => {
                AsyncStorage.setItem(config.userIdKey, resp.id)
                this.setState({
                    profileImage: resp.image //can I render this server-side to be exactly the dimensions I need based on config.screenWidth? are my other profile images utilizing '=s40-c' ?
                })
                return
            })
            .then(() => { // Used to be .then(key => {... but I didn't understand the key part and console.loggin key was giving undefined
                this.timerSuccess()
                this.setState({
                    loginHand: 'thumbs-up',
                    loginStatus: "Let's go!",
                    loginColor: config.colors.activeButton,
                    textColor: 'rgb(128,10,14)'
                })
                Keyboard.dismiss()
            })
            .catch(err => {
                console.log(err.message)
                this.timerFail()
                this.setState({
                    loginHand: 'thumbs-down',
                    loginStatus: '   Nope   ',
                    loginColor: config.colors.failButton,
                    textColor: 'rgb(115, 115, 0)'
                })
            })
    }

    register(cred) {
        if (this.state.userExists === undefined) {
            return this.turbo.createUser(cred)
        } else {
            this.setState({
                loginHand: 'thumbs-down',
                loginStatus: '   Taken  ',
                loginColor: config.colors.failButton,
                textColor: 'rgb(115, 115, 0)'
            })
            this.timerFail()
        }
    }

    login(cred) {
        return this.turbo.login(cred)
    }

    componentDidMount() {
        this.getPermissionAsync()
        this.setState({
            enterTheater: true
        })
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
            <Animated.View style={[styles.container, {opacity: this.state.enterTheater ? this.state.fadeInScreen : this.state.fadeOutScreen}]}>

                <StatusBar barStyle='light-content'/>

                <View style={{position: 'absolute', backgroundColor: 'rgb(255,255,255)', width: config.screenWidth, height: config.screenWidth}}></View>

                <Video source={config.videos.countdownMp4} shouldPlay isLooping style={{position: 'absolute', top: Math.round(config.screenWidth * .15), opacity: .4, width: Math.round(config.screenWidth * .75), height: Math.round(config.screenWidth * .6)}} />

                <Animated.View style={{opacity: this.state.fadeInProfilePic, position: 'absolute', top: Math.round(config.screenWidth * .16667)}}><Image source={{uri: this.state.profileImage !== '' ? this.state.profileImage : null}} style={{width: Math.round(config.screenWidth * .75), height: Math.round(config.screenWidth * .58333)}}/></Animated.View>

                <Image source={config.images.theaterPng} style={{position: 'absolute', width: config.screenWidth, height: Math.round(config.screenWidth * 1.58333)}}/>

                <Text style={[{position: 'absolute', top: Math.round(config.screenWidth * .39), left: Math.round(config.screenWidth * .17), fontSize: 14, fontWeight: 'bold', color: `'hsl(${this.state.selfieIconHue}, 75%, 25%)'`}, styles.leftIconShadow]}>{this.state.imageProcessingStatus}</Text>

                <Animated.View style={{opacity: this.state.fadeOutVeil, position: 'absolute', width: config.screenWidth, height: config.screenWidth * 2, backgroundColor: 'rgb(0,0,0)'}}/>

                <Animated.View style={{opacity: this.state.fadeInInterface}}>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: Math.round(config.screenWidth * .16667), padding: 8}}>
                        { this.state.loginScreen ? <TouchableOpacity onPress={() => this.togglePage()} activeOpacity={0.1} style={{paddingVertical: 15, paddingHorizontal: 5}}>
                            <Ionicons name="md-person" size={52} color={config.colors.activeButton} style={styles.leftIconShadow}/>
                        </TouchableOpacity> : <TouchableOpacity onPress={() => this.toggleSelectImage()} activeOpacity={0.1} style={{paddingVertical: 15, paddingHorizontal: 2}}>
                            <MaterialCommunityIcons name="tag-faces" size={45} color={`'hsl(${this.state.selfieIconHue}, 75%, 25%)'`} style={[{paddingVertical: 4}, styles.leftIconShadow]}/>
                        </TouchableOpacity> }
                        <TouchableOpacity onPress={() => this.togglePage()} activeOpacity={0.1} style={{paddingVertical: 15, paddingHorizontal: 5}}>
                            <MaterialCommunityIcons name="new-box" size={48} color={this.state.loginScreen ? config.colors.inactiveButton : config.colors.activeButton}  style={styles.newIconShadow}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.submit()} activeOpacity={0.1} style={[{paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: this.state.textColor, borderRadius: 10}, styles.loginStatusShadow]}>
                            <Text style={{fontSize: 16, fontWeight: 'bold', color: this.state.textColor}}>{this.state.loginStatus}</Text>
                            <Entypo style={this.state.loginHand === 'thumbs-up' ? {transform: [{rotateY: '180deg'}]} : null} name={this.state.loginHand} size={this.state.handSize} color={this.state.loginColor}/>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={[styles.inputs, styles.textInput1Shadow]}
                        placeholder={'username'}
                        placeholderTextColor={config.colors.activeButton}
                        autoCapitalize={'none'}
                        autoCorrect={false} spellCheck={false}
                        onChangeText={text => this.updateCredentials(text, 'username')}
                        onSubmitEditing={() => this.secondTextInput.focus()}
                        returnKeyType={"next"}
                    />

                    <TextInput
                        style={[styles.inputs, styles.textInput2Shadow]}
                        placeholder={'password'}
                        placeholderTextColor={config.colors.activeButton}
                        onChangeText={text => this.updateCredentials(text, 'password')}
                        onSubmitEditing={() => this.submit()}
                        returnKeyType={'go'}
                        ref={(input) => { this.secondTextInput = input }}
                        blurOnSubmit={false} secureTextEntry
                    />

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
    inputs: {
        width: 250,
        height: 36,
        fontSize: 16,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'rgb(255,255,255)',
        opacity: .6
    },
    leftIconShadow: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .6,
        shadowRadius: 2,
        shadowOffset: {width: -10, height: 12}
    },
    newIconShadow: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .6,
        shadowRadius: 2,
        shadowOffset: {width: -4, height: 12}
    },
    loginStatusShadow: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .6,
        shadowRadius: 2,
        shadowOffset: {width: 10, height: 12}
    },
    textInput1Shadow: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .85,
        shadowRadius: 2,
        shadowOffset: {width: 0, height: 8}
    },
    textInput2Shadow: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .85,
        shadowRadius: 2,
        shadowOffset: {width: 0, height: 10}
    }
})

export default Authenticate
