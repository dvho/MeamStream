import React from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Keyboard, Image, FlatList, KeyboardAvoidingView, Animated, Easing } from 'react-native'
import { GiphyOption, Png, Words } from './'
import { Video } from 'expo-av'
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
const giphy = require('giphy-api')() //eventually apply for development API key and then production API key https://developers.giphy.com/faq/
import utils from '../../utils'
import config from '../../config'

class SendMessage extends React.Component {
    constructor() {
        super()
        this.state = {
            keyboardHeight: 0,
            fadeInCanvas: new Animated.Value(0),
            subscreen: false,
            directions: 'Welcome', //This is never really revealed because it's behind the keyboard which calls the updateDirecions function onBlur, which immediately changes it to some other statement. It's shown for a split second only in the case when 'Next' key on Keyboard is used to automatically focus on the mainInput from the top input where recipient is entered.
            giphySearchPhrase: '',
            giphyArray: [], //this will be what is temporarily set in state upon calling giphy.search('...'
            //giphyStickers: [] // this will be what is temporarily set in state upon calling giphy.search({api: 'stickers', q: '...'
            newMessage: {
                toUser: '',
                //message: '',
                //Instead of message here I'll have canvasChoice, sticker1Choice, sticker2Choice, textChoice, etc. along with a width coefficient prop and position props for each one using React Native PanResponder (https://medium.com/@leonardobrunolima/react-native-tips-using-animated-and-panresponder-components-to-interact-with-user-gestures-4620bf27b9e4). Then newMessage will be an object with toUser and dozens of other fields, some of which might be empty strings. The object will render dynamically in a flatlist with a MemeStream parser component.
                giphyCanvasId: '',
                giphyPng1Id: '',
                giphyPng2Id: '',
                giphyPng3Id: '',
                giphyPng4Id: '',
                giphyPng5Id: '',
                words: ''
            },
            selectGiphyCanvasId: true,
            selectGiphyPng1Id: false,
            selectGiphyPng2Id: false,
            selectGiphyPng3Id: false,
            selectGiphyPng4Id: false,
            selectGiphyPng5Id: false,
            selectWords: false
        }
        this._keyboardDidShow = this._keyboardDidShow.bind(this)
        //this._keyboardDidHide = this._keyboardDidHide.bind(this)
    }

        componentDidMount() {
            Animated.timing(                // Animate over time
              this.state.fadeInCanvas,     // The animated value to drive
              { toValue: 1,                 // Animate to opacity: 1
                delay: 1000,                // Wait 1000ms so keyboard can swing up
                duration: 500,             // Make it take 500ms
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
                this.updateNewMessage(this.props.toUser, 'toUser')
            }
        }

        _keyboardDidShow(e) {
            this.setState({
                keyboardHeight: e.endCoordinates.height
            })
        }

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
                directions: this.state.selectWords ? ' Text something here and hit send! ' : ' Update this layer by entering a search phrase and selecting an animation. '
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

        setLayer(layer) {
            if (layer === 'canvas') {
                this.setState({
                    giphySearchPhrase: '',
                    selectGiphyCanvasId: true,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                    selectWords: false
                })
            }
            if (layer === 'png1') {
                this.setState({
                    giphySearchPhrase: '',
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: true,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                    selectWords: false
                })
            }
            if (layer === 'png2') {
                this.setState({
                    giphySearchPhrase: '',
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: true,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                    selectWords: false
                })
            }
            if (layer === 'png3') {
                this.setState({
                    giphySearchPhrase: '',
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: true,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                    selectWords: false
                })
            }
            if (layer === 'png4') {
                this.setState({
                    selectGiphyCanvasId: false,
                    giphySearchPhrase: '',
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: true,
                    selectGiphyPng5Id: false,
                    selectWords: false
                })
            }
            if (layer === 'png5') {
                this.setState({
                    giphySearchPhrase: '',
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: true,
                    selectWords: false
                })
            }
            if (layer === 'words') {
                this.setState({
                    giphySearchPhrase: '',
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                    selectWords: true
                })
            }
            setTimeout(() => this.updateDirections(), 0)
        }

        updateNewMessage(text, field) {
            if (this.state.selectGiphyCanvasId) {
                field = 'giphyCanvasId'
            } else if (this.state.selectGiphyPng1Id) {
                field = 'giphyPng1Id'
            } else if (this.state.selectGiphyPng2Id) {
                field = 'giphyPng2Id'
            } else if (this.state.selectGiphyPng3Id) {
                field = 'giphyPng3Id'
            } else if (this.state.selectGiphyPng4Id) {
                field = 'giphyPng4Id'
            } else if (this.state.selectGiphyPng5Id) {
                field = 'giphyPng5Id'
            } else if (this.state.selectWords) {
                field = 'words'
            }
            let newMessage = Object.assign({}, this.state.newMessage)
            newMessage[field] = text
            this.setState({
                newMessage: newMessage,
                subscreen: false
            })
            this.mainInput.focus()
            //toggle to next layer here
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
            if (this.state.selectGiphyCanvasId) {
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

                <Animated.View style={{flexDirection: 'column', bottom: this.state.keyboardHeight, opacity: this.state.fadeInCanvas}}>

                    <KeyboardAvoidingView behavior='padding' style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>

                        <Video source={config.videos.waitingMp4} shouldPlay isLooping style={[styles.canvas, {display: (this.state.giphySearchPhrase === '' && this.state.subscreen && this.state.newMessage.giphyCanvasId !== '') || (this.state.newMessage.giphyCanvasId === '' && !this.state.subscreen) || (this.state.subscreen && this.state.giphySearchPhrase === '' && this.state.newMessage.giphyCanvasId === '') ? 'flex' : 'none'}]} />

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyCanvasId}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.canvas, {display: this.state.subscreen !== false || this.state.newMessage.giphyCanvasId === '' ? 'none' : 'flex'}]}/>

                        <View style={{position: 'absolute', zIndex: this.state.selectGiphyPng1Id ? 10 : 1, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectGiphyPng1Id} giphyPngId={this.state.newMessage.giphyPng1Id}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectGiphyPng2Id ? 10 : 2, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectGiphyPng2Id} giphyPngId={this.state.newMessage.giphyPng2Id}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectGiphyPng3Id ? 10 : 3, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectGiphyPng3Id} giphyPngId={this.state.newMessage.giphyPng3Id}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectGiphyPng4Id ? 10 : 4, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectGiphyPng4Id} giphyPngId={this.state.newMessage.giphyPng4Id}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectGiphyPng5Id ? 10 : 5, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Png selected={this.state.selectGiphyPng5Id} giphyPngId={this.state.newMessage.giphyPng5Id}/></View>

                        <View style={{position: 'absolute', zIndex: this.state.selectWords ? 10 : 6, display: this.state.subscreen !== false ? 'none' : 'flex'}}><Words selected={this.state.selectWords} words={this.state.newMessage.words}/></View>


                        <FlatList
                            style={[styles.canvas, {display: !this.state.subscreen || this.state.giphySearchPhrase === '' || this.state.giphyArray === [] ? 'none' : 'flex'}]}
                            data={this.state.giphyArray}
                            initialNumToRender={1}
                            keyExtractor={item => item.id}
                            horizontal
                            renderItem={({item}) => <GiphyOption gifId={item.id} getGiphyId={()=>this.updateNewMessage(item.id, 'giphyId')}/>}
                            />

                    </KeyboardAvoidingView>

                    <View style={{flexDirection: 'row', justifyContent: 'center', height: 30, width: 100 + '%'}}>

                        <TouchableOpacity onPress={() => this.cancel()} activeOpacity={0.7} style={[styles.button, {flex: 1, marginLeft: 12}]}><MaterialIcons style={{marginTop: -4}} name='cancel' color={config.colors.dormantButton} size={26}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setState({subscreen: !this.state.subscreen})} activeOpacity={0.7} style={[styles.button, {flex: 2}]}><MaterialCommunityIcons style={[{marginTop: -13}, !this.state.subscreen ? {transform: [{rotateY: '180deg'}]} : null]} color={!this.state.subscreen ? config.colors.toggleArranging : config.colors.toggleSearching} name='toggle-switch' size={52}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('canvas')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><FontAwesome style={{marginTop: -4}} name='file-movie-o' color={this.state.newMessage.giphyCanvasId === '' ? (this.state.selectGiphyCanvasId ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectGiphyCanvasId ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png1')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-1' color={this.state.newMessage.giphyPng1Id === '' ? (this.state.selectGiphyPng1Id ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectGiphyPng1Id ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png2')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-2' color={this.state.newMessage.giphyPng2Id === '' ? (this.state.selectGiphyPng2Id ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectGiphyPng2Id ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png3')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-3' color={this.state.newMessage.giphyPng3Id === '' ? (this.state.selectGiphyPng3Id ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectGiphyPng3Id ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png4')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-4' color={this.state.newMessage.giphyPng4Id === '' ? (this.state.selectGiphyPng4Id ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectGiphyPng4Id ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png5')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-5' color={this.state.newMessage.giphyPng5Id === '' ? (this.state.selectGiphyPng5Id ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectGiphyPng5Id ? config.colors.selectingButton : config.colors.selectedButton)} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('words')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialCommunityIcons style={{marginTop: -1}} name='format-text' color={this.state.newMessage.words === '' ? (this.state.selectWords ? config.colors.selectingButton : config.colors.dormantButton) : (this.state.selectWords ? config.colors.selectingButton : config.colors.selectedButton)} size={28}/></TouchableOpacity>



                        <TouchableOpacity onPress={() => this.send()} activeOpacity={0.7} style={[styles.button, {flex: 1, marginLeft: 6, marginRight: 16}]}><FontAwesome style={{marginTop: -4}} name='send' color={config.colors.sendButton} size={22}/></TouchableOpacity>


                    </View>

                    <TextInput
                        placeholder={this.state.selectWords ? "Text something here..." : "Search phrase..."}
                        placeholderTextColor={'rgba(0,0,0, .6)'}
                        ref={input => this.mainInput = input}
                        autoFocus={this.props.toUser === undefined ? false : true}
                        style={[styles.inputs, {marginBottom: 5, paddingVertical: 5}]}
                        multiline={this.state.selectWords ? true : false}
                        autoCapitalize={this.state.selectWords ? 'sentences' : 'none'}
                        autoCorrect={this.state.selectWords ? true : false}
                        spellCheck={this.state.selectWords ? true : false}
                        maxLength={this.state.selectWords ? null : 46}
                        value={this.state.selectWords ? this.state.newMessage.words : this.state.giphySearchPhrase}
                        onChangeText={this.state.selectWords ? text => this.updateNewMessage(text, 'words') : text => this.searchGiphy(text)}
                        onBlur={()=>this.updateDirections()}
                        returnKeyType={this.state.selectWords ? null : 'next'}
                    />

                    { /* <TextInput
                        placeholder={"I'm feeling..."}
                        placeholderTextColor={'rgba(0,0,0, .3)'}
                        autoFocus={this.props.toUser === undefined ? false : true}
                        style={styles.inputs}
                        multiline={false}
                        value={this.state.newMessage.message}
                        onChangeText={text => this.updateNewMessage(text, 'message')}
                    /> */}

                </Animated.View>

                <View style={{position: 'absolute', bottom: 0, height: this.state.keyboardHeight, width: 100 + '%', display: 'flex', alignItems: 'center'}}>
                        <Text style={{textAlign: 'center', color: 'rgb(215,215,215)', fontSize: 20, fontWeight: 'bold', letterSpacing: .5}}>{this.state.directions}</Text>
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
        justifyContent: 'space-between',
        paddingBottom: 64
    },
    inputs: {
        width: config.screenWidth - 10,
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
