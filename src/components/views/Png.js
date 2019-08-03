import React from 'react'
import { View, PanResponder, Animated, Image, StyleSheet } from 'react-native'
import config from '../../config'
import { FontAwesome } from '@expo/vector-icons'

//https://medium.com/@leonardobrunolima/react-native-tips-using-animated-and-panresponder-components-to-interact-with-user-gestures-4620bf27b9e4
//https://codedaily.io/tutorials/1/Maintain-Touchable-Items-with-a-Parent-PanResponder-in-React-Native
//https://stackoverflow.com/questions/42014379/panresponder-snaps-animated-view-back-to-original-position-on-second-drag
//https://stackoverflow.com/questions/41638032/how-to-pass-data-between-child-and-parent-in-react-native
//I wanted to have Pngs fade out when dragged out of range and fade back into the center of the canvas but https://facebook.github.io/react-native/docs/animations#caveats

class Png extends React.Component {
    constructor(props) {
        super(props)
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
           onStartShouldSetPanResponder: () => true,
           onPanResponderMove: (event, gesture) => {
               if (((gesture.moveX - event.nativeEvent.locationX - 11) > 0) && ((gesture.moveX - event.nativeEvent.locationX + config.pngWidth - 11) < config.canvasWidth ) && ((gesture.moveY - event.nativeEvent.locationY - config.headerHeight - 41) > 0) && ((gesture.moveY - event.nativeEvent.locationY + config.pngWidth - 41) < (config.canvasHeight + config.headerHeight))) {
                   setTimeout(() => position.setValue({ x: gesture.dx, y: gesture.dy }), 0) //draggable content will get lost unless position.setValue is broken out into a setTimeout.
                   this.setState({
                       coords: {
                           x: (gesture.moveX - event.nativeEvent.locationX - 11) / config.canvasWidth,
                           y: (gesture.moveY - event.nativeEvent.locationY - config.headerHeight - 41) / config.canvasHeight
                       },
                       outOfRange: false
                   })
               } else { //else setTimeout later than the one above that pulls the dragable content back just before it went out of range.
                   this.setState({
                       outOfRange: true
                   })
                   setTimeout(() => {
                       position.setValue({ x: 0, y: 0 })
                       this.setState({outOfRange: false})
                   }, 1000)
               }
           },
           onPanResponderGrant: (event, gesture) => {
               this.state.position.setOffset({x: this.state.position.x._value, y: this.state.position.y._value});
               this.state.position.setValue({x: 0, y: 0})
           },
           onPanResponderRelease: (event, {vx, vy}) => {
               this.state.position.flattenOffset()
               setTimeout(()=>this.props.updateCoords(this.state.coords), 10) //If you don't call this function within onPanResponderRelease (i.e. if you call it in your render function above return) you'll get the error from SendMessage "Invariant Violation: Maximum update depth exceeded. This can happen when a component repeatedly calls setState..." because it will be calling this.props.updateCoords incessantly which is, in turn, calling setState. For some reason it doesn't like setState being nested in a function that's being called from another component. Also, if you don't break the chain with a setTimeout it'll update with coordinates from the release before.
           }
        })
        this.state = {
            panResponder: panResponder,
            position: position,
            coords: {},
            outOfRange: false
        }
    }

   render() {
       let handlers = this.state.panResponder.panHandlers
       return (
         <Animated.View style={this.state.position.getLayout()} {...handlers}>

            <Image style={{width: config.pngWidth, height: config.pngWidth, borderRadius: config.borderRadii, borderWidth: this.props.selected && this.props.giphyPngId !== '' ? StyleSheet.hairlineWidth : null, borderColor: 'rgb(255,255,255)', opacity: this.state.outOfRange ? 0 : 1}} source={{uri: `https://media2.giphy.com/media/${this.props.giphyPngId}/100.gif`}} resizeMode='contain' resizeMethod='scale'/>

            <View style={{width: config.pngWidth, height: config.pngWidth, position: 'absolute', opacity: this.state.outOfRange ? .8 : 0, borderRadius: config.borderRadii, borderWidth: this.props.selected && this.props.giphyPngId !== '' ? StyleSheet.hairlineWidth : null, borderColor: 'rgb(255,255,255)'}}><FontAwesome name={'undo'} size={config.pngWidth} color={'rgb(255,255,255)'} style={{alignSelf: 'center'}}/></View>

         </Animated.View>
      )
   }
}

export default Png
