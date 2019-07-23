import React from 'react'
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Keyboard, Image, FlatList, KeyboardAvoidingView } from 'react-native'
import { GiphyOption } from './'
import { Video } from 'expo-av'
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
const giphy = require('giphy-api')(); //eventually apply for development API key and then production API key https://developers.giphy.com/faq/
import utils from '../../utils'
import config from '../../config'

//Canvas = I'm feeling
//Stickers 1-5 = I'm also feeling

class SendMessage extends React.Component {
    constructor() {
        super()
        this.state = {
            keyboardHeight: 0,
            subscreen: false,
            giphySearchPhrase: '',
            giphyArray: [], //this will be what is temporarily set in state upon calling giphy.search('...'
            //giphyStickers: [] // this will be what is temporarily set in state upon calling giphy.search({api: 'stickers', q: '...'
            newMessage: {
                toUser: '',
                message: '',
                //Instead of message here I'll have canvasChoice, sticker1Choice, sticker2Choice, textChoice, etc. along with a width coefficient prop and position props for each one using React Native PanResponder (https://snack.expo.io/@yoobidev/draggable-component). Then newMessage will be an object with toUser and dozens of other fields, some of which might be empty strings. The object will render dynamically in a flatlist with a MemeStream parser component.
                giphyCanvasId: '',
                giphyPng1Id: '',
                giphyPng2Id: '',
                giphyPng3Id: '',
                giphyPng4Id: '',
                giphyPng5Id: '',
            },
            selectGiphyCanvasId: true,
            selectGiphyPng1Id: false,
            selectGiphyPng2Id: false,
            selectGiphyPng3Id: false,
            selectGiphyPng4Id: false,
            selectGiphyPng5Id: false,
        }
        this._keyboardDidShow = this._keyboardDidShow.bind(this)
        //this._keyboardDidHide = this._keyboardDidHide.bind(this)
    }

        componentDidMount() {

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

        updateRecipient(text, field) {
            let newMessage = Object.assign({}, this.state.newMessage)
            newMessage[field] = text
            this.setState({
                newMessage: newMessage,
                subscreen: false
            })
            this.searchInput.focus()
        }

        setLayer(layer) {
            if (layer === 'canvas') {
                this.setState({
                    selectGiphyCanvasId: true,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                })
            }
            if (layer === 'png1') {
                this.setState({
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: true,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                })
            }
            if (layer === 'png2') {
                this.setState({
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: true,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                })
            }
            if (layer === 'png3') {
                this.setState({
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: true,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: false,
                })
            }
            if (layer === 'png4') {
                this.setState({
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: true,
                    selectGiphyPng5Id: false,
                })
            }
            if (layer === 'png5') {
                this.setState({
                    selectGiphyCanvasId: false,
                    selectGiphyPng1Id: false,
                    selectGiphyPng2Id: false,
                    selectGiphyPng3Id: false,
                    selectGiphyPng4Id: false,
                    selectGiphyPng5Id: true,
                })
            }
        }

        updateNewMessage(text, field) {
            if (this.state.selectGiphyCanvasId === true) {
                field = 'giphyCanvasId'
            } else if (this.state.selectGiphyPng1Id === true) {
                field = 'giphyPng1Id'
            } else if (this.state.selectGiphyPng2Id === true) {
                field = 'giphyPng2Id'
            } else if (this.state.selectGiphyPng3Id === true) {
                field = 'giphyPng3Id'
            } else if (this.state.selectGiphyPng4Id === true) {
                field = 'giphyPng4Id'
            } else if (this.state.selectGiphyPng5Id === true) {
                field = 'giphyPng5Id'
            }

            let newMessage = Object.assign({}, this.state.newMessage)
            newMessage[field] = text
            this.setState({
                newMessage: newMessage,
                subscreen: false
            })
            this.searchInput.focus()
        }

        cancel() {
            this.props.toggleCreateMessage()
            this.updateNewMessage('', 'toUser')
            this.updateNewMessage('', 'message')
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
            if (this.state.selectGiphyCanvasId === true) {
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
                }.bind(this));
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
                }.bind(this));
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
                        value={this.state.newMessage.toUser}
                        onChangeText={text => this.updateRecipient(text, 'toUser')}
                    />
                </View>


                <View style={[{flexDirection: 'column'}, {bottom: this.state.keyboardHeight}]}>



                    <KeyboardAvoidingView behavior='padding' style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>


                        <Video source={config.videos.waitingMp4} shouldPlay isLooping style={[styles.canvas, {display: (this.state.giphySearchPhrase === '' && this.state.subscreen === true && this.state.newMessage.giphyCanvasId !== '') || (this.state.newMessage.giphyCanvasId === '' && this.state.subscreen === false) || (this.state.subscreen === true && this.state.giphySearchPhrase === '' && this.state.newMessage.giphyCanvasId === '') ? 'flex' : 'none'}]} />

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyCanvasId}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.canvas, {display: this.state.subscreen !== false || this.state.newMessage.giphyCanvasId === '' ? 'none' : 'flex'}]}/>

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyPng1Id}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.png, {display: this.state.subscreen !== false ? 'none' : 'flex'}]}/>

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyPng2Id}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.png, {display: this.state.subscreen !== false ? 'none' : 'flex'}]}/>

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyPng3Id}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.png, {display: this.state.subscreen !== false ? 'none' : 'flex'}]}/>

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyPng4Id}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.png, {display: this.state.subscreen !== false ? 'none' : 'flex'}]}/>

                        <Image source={{uri: `https://media.giphy.com/media/${this.state.newMessage.giphyPng5Id}/giphy.gif`}} resizeMode='contain' resizeMethod='scale' style={[styles.png, {display: this.state.subscreen !== false ? 'none' : 'flex'}]}/>

                        <FlatList
                            style={[styles.canvas, {display: this.state.subscreen === false || this.state.giphySearchPhrase === '' || this.state.giphyArray === [] ? 'none' : 'flex'}]}
                            data={this.state.giphyArray}
                            initialNumToRender={1}
                            keyExtractor={item => item.id}
                            horizontal
                            renderItem={({item}) => <GiphyOption gifId={item.id} getGiphyId={()=>this.updateNewMessage(item.id, 'giphyId')}/>}
                            />


                    </KeyboardAvoidingView>





                    <View style={{flexDirection: 'row', justifyContent: 'center', height: 30, width: 100 + '%'}}>

                        <TouchableOpacity onPress={() => this.cancel()} activeOpacity={0.7} style={[styles.button, {flex: 1, marginLeft: 12}]}><MaterialIcons style={{marginTop: -4}} name='cancel' color={config.colors.dormantButton} size={26}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setState({subscreen: !this.state.subscreen})} activeOpacity={0.7} style={[styles.button, {flex: 2}]}><MaterialCommunityIcons style={[{marginTop: -13}, this.state.subscreen === false ? {transform: [{rotateY: '180deg'}]} : null]} color={this.state.subscreen === false ? config.colors.productionButton : config.colors.activeButton} name='toggle-switch' size={52}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('canvas')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><FontAwesome style={{marginTop: -4}} name='file-movie-o' color={this.state.selectGiphyCanvasId === true ? config.colors.selectionButton : config.colors.dormantButton} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png1')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-1' color={this.state.selectGiphyPng1Id === true ? config.colors.selectionButton : config.colors.dormantButton} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png2')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-2' color={this.state.selectGiphyPng2Id === true ? config.colors.selectionButton : config.colors.dormantButton} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png3')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-3' color={this.state.selectGiphyPng3Id === true ? config.colors.selectionButton : config.colors.dormantButton} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png4')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-4' color={this.state.selectGiphyPng4Id === true ? config.colors.selectionButton : config.colors.dormantButton} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.setLayer('png5')} activeOpacity={0.7} style={[styles.button, {flex: 1}]}><MaterialIcons style={{marginTop: -4}} name='filter-5' color={this.state.selectGiphyPng5Id === true ? config.colors.selectionButton : config.colors.dormantButton} size={22}/></TouchableOpacity>

                        <TouchableOpacity onPress={() => this.send()} activeOpacity={0.7} style={[styles.button, {flex: 1, marginLeft: 6, marginRight: 16}]}><FontAwesome style={{marginTop: -4}} name='send' color='rgb(182,182,255)' size={22}/></TouchableOpacity>

                    </View>



                    <TextInput
                        placeholder={"I'm feeling..."}
                        placeholderTextColor={'rgba(0,0,0, .6)'}
                        ref={input => this.searchInput = input}
                        autoFocus={this.props.toUser === undefined ? false : true}
                        style={[styles.inputs, {marginBottom: 5}]}
                        multiline={false}
                        value={this.state.giphySearchPhrase}
                        onChangeText={text => this.searchGiphy(text)}
                    />








{ /*                   <TextInput
                        placeholder={"I'm feeling..."}
                        placeholderTextColor={'rgba(0,0,0, .3)'}
                        autoFocus={this.props.toUser === undefined ? false : true}
                        style={styles.inputs}
                        multiline={false}
                        value={this.state.newMessage.message}
                        onChangeText={text => this.updateNewMessage(text, 'message')}
                    /> */}

                </View>

                <View style={{position: 'absolute', bottom: 0, height: this.state.keyboardHeight, width: 100 + '%', display: 'flex', alignItems: 'center'}}>
                        <Text style={{color: 'rgba(255,255,255,.8)', fontSize: 20, fontWeight: 'bold'}}>Go</Text>
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
        position: 'absolute',
        width: config.screenWidth/4,
        height: config.screenWidth/4,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    }
})

export default SendMessage
