import React from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Keyboard, Image, FlatList, KeyboardAvoidingView, Animated, Easing } from 'react-native'
import { GiphyOption, Png, Words } from './'
import { Video } from 'expo-av'
import { MaterialCommunityIcons, MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons'
const giphy = require('giphy-api')() //eventually apply for development API key and then production API key https://developers.giphy.com/faq/
import utils from '../../utils'
import config from '../../config'

//TODO: 3) need to build out parser for MessageShort.js, 4) need to validate phone numbers instead of userName in Authenticate, 5) need to gain access to contacts, 6) need to integrate push notifications, 7) Need to make Profile screen do more than just logout 8) need to make 3rd BottomTabNavigator tab that shows all my sent memes, 9) need to add those png curtains to Authenticate.js


class SendMessage extends React.Component {
    constructor() {
        super()
        this.state = {
            keyboardHeight: 0,
            fadeInWorkArea: new Animated.Value(0),
            subscreen: false,
            directions: 'Welcome', //This is never really revealed because it's behind the keyboard which calls the updateDirecions function onBlur, which immediately changes it to some other statement. It's shown for a split second only in the case when 'Next' key on Keyboard is used to automatically focus on the mainInput from the top input where recipient is entered.
            giphySearchPhrase: '',
            giphyArray: [],
            newMessage: {
                toUser: '',
                message: '',
                giphyCanvasId: '',
                giphyPng1Id: '',
                giphyPng1Coords: {x:0.37362637362637363, y:0.3178963893249608},
                giphyPng2Id: '',
                giphyPng2Coords: {x:0.37362637362637363, y:0.3178963893249608},
                giphyPng3Id: '',
                giphyPng3Coords: {x:0.37362637362637363, y:0.3178963893249608},
                giphyPng4Id: '',
                giphyPng4Coords: {x:0.37362637362637363, y:0.3178963893249608},
                giphyPng5Id: '',
                giphyPng5Coords: {x:0.37362637362637363, y:0.3178963893249608},
                words: '',
                wordsCoords: {x: -0.01, y: -0.01} //need to make this update as one types but be overridden when panResponder starts
            },
            selectedLayer: 'giphyCanvasId'
        }
        this._keyboardDidShow = this._keyboardDidShow.bind(this)
        //this._keyboardDidHide = this._keyboardDidHide.bind(this)
        this.updateCoords = this.updateCoords.bind(this)
    }

        componentDidMount() {
            Animated.timing(                // Animate over time
              this.state.fadeInWorkArea,     // The animated value to drive
              { toValue: 1,                 // Animate to opacity: 1
                delay: 500,                // Wait 500ms so keyboard can swing up
                duration: 1000,             // Make it take 1000ms
                easing: Easing.bezier(0, 0, 0, 1, 1)
              }).start()

            this.keyboardDidShowListener = Keyboard.addListener(
                'keyboardDidShow',
                this._keyboardDidShow,
            )
            this.keyboardDidHideListener = Keyboard.addListener(
                'keyboardDidHide',
                this._keyboardDidHide,
            )
            if (this.props.toUser !== undefined) {
                this.updateRecipient(this.props.toUser, 'toUser')
            }
        }

        _keyboardDidShow(e) {
            this.setState({
                keyboardHeight: e.endCoordinates.height
            })
        }

        //Don't need to use this right now because keyboardHeight shoudn't be set back to zero when keyboard closes, otherwise the canvas will snap down
        // _keyboardDidHide(e) {
        //     this.setState({
        //         keyboardHeight: 0
        //     })
        // }

        componentWillUnmount() {
            this.keyboardDidShowListener.remove()
            this.keyboardDidHideListener.remove()
        }

        navigateToConversationFromSentMessage(data) {
            this.props.navProps.navigate('conversation', {me: data.fromUser, user: data.toUser, newMessage: data})
        }

        updateDirections() {
            this.setState({
                directions: this.state.selectedLayer === 'message' ? '' : (this.state.selectedLayer === 'words' ? 'Type something here. Make sure your other layers are where you want them and hit send!' : 'Update this layer by entering a search phrase and selecting an animation.')
            })
        }

        updateRecipient(text, field) {
            let newMessage = Object.assign({}, this.state.newMessage)
            newMessage[field] = text
            this.setState({
                newMessage: newMessage,
                subscreen: false
            })
        }

        updateCoords(obj) {
            let coords
            if (this.state.selectedLayer === 'giphyCanvasId') {
                return
            }
            if (this.state.selectedLayer === 'giphyPng1Id') {
                coords = 'giphyPng1Coords'
            }
            if (this.state.selectedLayer === 'giphyPng2Id') {
                coords = 'giphyPng2Coords'
            }
            if (this.state.selectedLayer === 'giphyPng3Id') {
                coords = 'giphyPng3Coords'
            }
            if (this.state.selectedLayer === 'giphyPng4Id') {
                coords = 'giphyPng4Coords'
            }
            if (this.state.selectedLayer === 'giphyPng5Id') {
                coords = 'giphyPng5Coords'
            }
            if (this.state.selectedLayer === 'words') {
                coords = 'wordsCoords'
            }
            let newMessage = Object.assign({}, this.state.newMessage)
            newMessage[coords] = obj
            this.setState({
                newMessage: newMessage,
                subscreen: false
            })
        }

        updateNewMessage(text, field) {
            let newMessage = Object.assign({}, this.state.newMessage)
            newMessage[this.state.selectedLayer] = text
            this.setState({
                newMessage: newMessage,
                subscreen: false
            })
            this.mainInput.focus()
        }

        setLayerAndDirections(choice) {
            const choiceArray = ['giphyCanvasId', 'giphyPng1Id', 'giphyPng2Id', 'giphyPng3Id', 'giphyPng4Id', 'giphyPng5Id', 'words']
            const forward = (choiceArray.indexOf(this.state.selectedLayer) + 1) % 7
            const backward = (7 + (choiceArray.indexOf(this.state.selectedLayer) - 1)) % 7

            if (choice === 'forward') {
                this.setState({selectedLayer: choiceArray[forward], giphySearchPhrase: ''})
            } else if (choice === 'backward') {
                this.setState({selectedLayer: choiceArray[backward], giphySearchPhrase: ''})
            } else {
                this.setState({selectedLayer: choice, giphySearchPhrase: ''})
            }
            setTimeout(() => this.updateDirections(), 0)
        }

        cancel() {
            this.props.toggleCreateMessage()
            this.updateNewMessage('', 'toUser')
            this.updateNewMessage('', 'message')
            this.updateNewMessage('', 'giphyCanvasId')
            this.updateNewMessage('', 'giphyPng1Id')
            this.updateNewMessage('', 'giphyPng2Id')
            this.updateNewMessage('', 'giphyPng3Id')
            this.updateNewMessage('', 'giphyPng4Id')
            this.updateNewMessage('', 'giphyPng5Id')
            this.updateNewMessage('', 'words')
        }

        send() {
            let params = this.state.newMessage
            utils
            .createMessages(params)
            .then(data => {
                if(data.confirmation === 'fail') {
                    throw new Error(data.message)
                } else {
                    this.navigateToConversationFromSentMessage(data.data)
                }
            })
            .catch(err => alert(err.message))
            this.cancel()
        }

        async searchGiphy(text) {
            await this.setState({
                giphySearchPhrase: text
            })
            if (this.state.selectedLayer === 'giphyCanvasId') {
                await giphy.search({
                    q: this.state.giphySearchPhrase,
                    limit: 100
                }, function (err, res) {
                    if (res.data) {
                        this.setState({
                            giphyArray: res.data,
                            subscreen: true
                        })
                    }
                }.bind(this))
            } else {
                await giphy.search({
                    api: 'stickers',
                    q: this.state.giphySearchPhrase,
                    limit: 100
                }, function (err, res) {
                    if (res.data) {
                        this.setState({
                            giphyArray: res.data,
                            subscreen: true
                        })
                    }
                }.bind(this))
            }
        }

    render() {

        return(
            <View style={styles.messageModal}>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>

                    <TextInput
                        placeholder={'To:'}
                        placeholderTextColor={'rgba(0,0,0, .6)'}
                        autoFocus={this.props.toUser === undefined ? true : false}
                        style={[styles.inputs, {marginTop: 5}]}
                        multiline={false}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        spellCheck={false}
                        value={this.state.newMessage.toUser}
                        onChangeText={text => this.updateRecipient(text, 'toUser')}
                        onSubmitEditing={() => this.mainInput.focus()}
                        returnKeyType={"next"}
                    />
                </View>

                {/* Need to put the old message block here with a conditional ternary display statement as to whether or not this.state.selectedLayer === 'message' */}
                {/* Need to change those opacity: 0 to visibility hidden, because the buttons are still active and causing problems */}
                <Animated.View style={{display: this.state.selectedLayer === 'message' ? 'none' : 'flex', flexDirection: 'column', top: 0, opacity: this.state.fadeInWorkArea}}>

                    <KeyboardAvoidingView behavior='padding' style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                        <Video source={config.videos.waitingMp4} shouldPlay isLooping style={[styles.canvas, {display: (this.state.giphySearchPhrase === '' && this.state.subscreen && this.state.newMessage.giphyCanvasId !== '') || (this.state.newMessage.giphyCanvasId === '' && !this.state.subscreen) || (this.state.subscreen && this.state.giphySearchPhrase === '' && this.state.newMessage.giphyCanvasId === '') ? 'flex' : 'none'}]} />

                        <Image source={{uri: `https://media2.giphy.com/media/${this.state.newMessage.giphyCanvasId}/200.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.canvas, {display: this.state.subscreen !== false || this.state.newMessage.giphyCanvasId === '' ? 'none' : 'flex'}]}/>

                        <View style={{position: 'absolute', zIndex: this.state.selectedLayer === 'giphyPng1Id' ? 10 : 1, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectedLayer === 'giphyPng1Id'} giphyPngId={this.state.newMessage.giphyPng1Id} onRef={ref => (this.updateCoords = ref)} updateCoords={this.updateCoords.bind(this)}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectedLayer === 'giphyPng2Id' ? 10 : 2, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectedLayer === 'giphyPng2Id'} giphyPngId={this.state.newMessage.giphyPng2Id} onRef={ref => (this.updateCoords = ref)} updateCoords={this.updateCoords.bind(this)}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectedLayer === 'giphyPng3Id' ? 10 : 3, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectedLayer === 'giphyPng3Id'} giphyPngId={this.state.newMessage.giphyPng3Id} onRef={ref => (this.updateCoords = ref)} updateCoords={this.updateCoords.bind(this)}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectedLayer === 'giphyPng4Id' ? 10 : 4, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectedLayer === 'giphyPng4Id'} giphyPngId={this.state.newMessage.giphyPng4Id} onRef={ref => (this.updateCoords = ref)} updateCoords={this.updateCoords.bind(this)}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectedLayer === 'giphyPng5Id' ? 10 : 5, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectedLayer === 'giphyPng5Id'} giphyPngId={this.state.newMessage.giphyPng5Id} onRef={ref => (this.updateCoords = ref)} updateCoords={this.updateCoords.bind(this)}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectedLayer === 'words' ? 10 : 6, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Words selected={this.state.selectedLayer === 'words'} words={this.state.newMessage.words} onRef={ref => (this.updateCoords = ref)} updateCoords={this.updateCoords.bind(this)}/></View>

                        <FlatList
                            style={[styles.canvas, {display: !this.state.subscreen || this.state.giphySearchPhrase === '' || this.state.giphyArray === [] ? 'none' : 'flex'}]}
                            data={this.state.giphyArray}
                            initialNumToRender={1}
                            keyExtractor={item => item.id}
                            horizontal
                            renderItem={({item}) => <GiphyOption gifId={item.id} getGiphyId={()=>this.updateNewMessage(item.id, 'giphyId')}/>}
                            />

                    </KeyboardAvoidingView>

                </Animated.View>

                    <Animated.View style={{bottom: this.state.keyboardHeight + 66, position: 'absolute', opacity: this.state.fadeInWorkArea}}>

                        <View style={{flexDirection: 'row', justifyContent: 'center', height: 30, width: 100 + '%'}}>

                            <TouchableOpacity onPress={() => this.cancel()} activeOpacity={0} style={[styles.button, {flex: 1, marginLeft: 6}]}><MaterialIcons style={{marginTop: -4}} name='cancel' color={config.colors.dormantButton} size={26}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setState({subscreen: !this.state.subscreen})} activeOpacity={1} style={[styles.button, {flex: 1.8}]}><MaterialCommunityIcons style={[{marginTop: -13, opacity: this.state.selectedLayer === 'message' ? 0 : 1}, !this.state.subscreen ? {transform: [{rotateY: '180deg'}]} : null]} color={!this.state.subscreen ? config.colors.toggleArranging : config.colors.toggleSearching} name='toggle-switch' size={52}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('backward')} activeOpacity={0} style={[styles.button, {flex: 1}]}><FontAwesome style={{marginTop: -4, marginRight: 4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='backward' color={config.colors.scrollButton} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('forward')} activeOpacity={0} style={[styles.button, {flex: 1}]}><FontAwesome style={{marginTop: -4, marginLeft: 4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='forward' color={config.colors.scrollButton} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('giphyCanvasId')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><FontAwesome style={{marginTop: -4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='file-movie-o' color={this.state.newMessage.giphyCanvasId === '' ? (this.state.selectedLayer === 'giphyCanvasId' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'giphyCanvasId' ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('giphyPng1Id')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='filter-1' color={this.state.newMessage.giphyPng1Id === '' ? (this.state.selectedLayer === 'giphyPng1Id' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'giphyPng1Id' ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('giphyPng2Id')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='filter-2' color={this.state.newMessage.giphyPng2Id === '' ? (this.state.selectedLayer === 'giphyPng2Id' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'giphyPng2Id' ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('giphyPng3Id')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='filter-3' color={this.state.newMessage.giphyPng3Id === '' ? (this.state.selectedLayer === 'giphyPng3Id' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'giphyPng3Id' ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('giphyPng4Id')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='filter-4' color={this.state.newMessage.giphyPng4Id === '' ? (this.state.selectedLayer === 'giphyPng4Id' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'giphyPng4Id' ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.setLayerAndDirections('giphyPng5Id')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='filter-5' color={this.state.newMessage.giphyPng5Id === '' ? (this.state.selectedLayer === 'giphyPng5Id' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'giphyPng5Id' ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                            <TouchableOpacity onPress={(this.state.newMessage.giphyCanvasId === '' && this.state.newMessage.giphyPng1Id === '' && this.state.newMessage.giphyPng2Id === '' && this.state.newMessage.giphyPng3Id === '' && this.state.newMessage.giphyPng4Id === '' && this.state.newMessage.giphyPng5Id === '') ? () => {this.setState({selectedLayer: 'message'}); this.setLayerAndDirections('message')} : () => this.setLayerAndDirections('words')} activeOpacity={0.3} style={[styles.button, {flex: 1}]}><MaterialCommunityIcons style={{marginTop: -1, opacity: this.state.selectedLayer === 'message' ? 0 : 1}} name='format-text' color={this.state.newMessage.words === '' ? (this.state.selectedLayer === 'words' ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectedLayer === 'words' ? config.colors.selectingButton : config.colors.selectedButton)} size={28}/></TouchableOpacity>

                            <TouchableOpacity onPress={() => this.send()} activeOpacity={0} style={[styles.button, {flex: 1, marginLeft: 2, marginRight: 6}]}><FontAwesome style={{marginTop: -4}} name='send' color={config.colors.sendButton} size={22}/></TouchableOpacity>

                        </View>

                        <TextInput
                            placeholder={this.state.selectedLayer === 'message' ? 'Regular text message' : (this.state.selectedLayer === 'words' ? "Type something here..." : "Enter a search phrase...")}
                            placeholderTextColor={'rgba(0,0,0, .6)'}
                            ref={input => this.mainInput = input}
                            autoFocus={this.props.toUser === undefined ? false : true}
                            style={[styles.inputs, {marginBottom: 5, opacity: .6}]}
                            multiline={this.state.selectedLayer === 'message' ? true : (this.state.selectedLayer === 'words' ? true : false)}
                            autoCapitalize={this.state.selectedLayer === 'message' ? 'sentences' : (this.state.selectedLayer === 'words' ? 'sentences' : 'none')}
                            autoCorrect={true}
                            spellCheck={true}
                            maxLength={this.state.selectedLayer === 'message' ? null : (this.state.selectedLayer === 'words' ? null : 46)}
                            value={this.state.selectedLayer === 'message' ? this.state.newMessage.message : (this.state.selectedLayer === 'words' ? this.state.newMessage.words : this.state.giphySearchPhrase)}
                            onChangeText={this.state.selectedLayer === 'message' ? text => this.updateNewMessage(text, 'message') : (this.state.selectedLayer === 'words' ? text => this.updateNewMessage(text, 'words') : text => this.searchGiphy(text))}
                            onBlur={()=>this.updateDirections()}
                            returnKeyType={this.state.selectedLayer === 'message' ? null : (this.state.selectedLayer === 'words' ? null : 'next')}
                        />
                </Animated.View>

                <View style={{position: 'absolute', bottom: 0, height: this.state.keyboardHeight, width: 100 + '%', display: 'flex', alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', paddingHorizontal: 10, color: 'rgb(215,215,215)', fontSize: 20, fontWeight: 'bold', letterSpacing: .5}}>{this.state.directions}</Text>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    messageModal: {
        width: 100 + '%',
        height: 100 + '%',
        marginTop: config.headerHeight,
        backgroundColor: 'rgba(64,64,64, .90)',
        flexDirection: 'column',
        //justifyContent: 'space-between',
        paddingBottom: 64
    },
    inputs: {
        width: config.screenWidth - 10,
        height: 32,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgb(255,255,255)',
        fontSize: 16,
        color: 'rgb(0,0,0)',
        opacity: .6,
        marginHorizontal: 5,
        borderRadius: config.screenWidth *.021875
    },
    canvas: {
        flex: 1,
        width: undefined,
        height: config.screenWidth * .7 - 10,
        margin: 5,
        backgroundColor: 'rgb(0,0,0)',
        borderColor: 'rgb(255,255,255)',
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: config.screenWidth *.021875
    },
    png: {
        position: 'absolute'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    }
})

export default SendMessage
