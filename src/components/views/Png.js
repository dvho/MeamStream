import React from 'react'
import { View, PanResponder, Animated, Image, StyleSheet } from 'react-native'
import config from '../../config'

class Png extends React.Component {
    constructor(props) {
        super(props)
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
           onStartShouldSetPanResponder: () => true,
           onPanResponderMove: (event, gesture) => {
               position.setValue({ x: gesture.dx, y: gesture.dy })
           }
        })
        this.state = { panResponder, position };
    }

   render() {
       let handlers = this.state.panResponder.panHandlers
      return (
         <Animated.View style={this.state.position.getLayout()} {...handlers}>
            <Image style={{width: config.screenWidth/4, height: config.screenWidth/4, borderRadius: config.screenWidth *.021875, borderWidth: this.props.selected && this.props.giphyPngId !== '' ? StyleSheet.hairlineWidth : null, borderColor: 'rgb(255,255,255)'}} source={{uri: `https://media.giphy.com/media/${this.props.giphyPngId}/giphy.gif`}} resizeMode='contain' resizeMethod='scale'/>
         </Animated.View>
      )
   }
}

export default Png
