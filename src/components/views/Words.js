import React from 'react'
import { View, PanResponder, Animated, Text } from 'react-native'
import config from '../../config'

//https://medium.com/@leonardobrunolima/react-native-tips-using-animated-and-panresponder-components-to-interact-with-user-gestures-4620bf27b9e4
//https://codedaily.io/tutorials/1/Maintain-Touchable-Items-with-a-Parent-PanResponder-in-React-Native
//https://stackoverflow.com/questions/42014379/panresponder-snaps-animated-view-back-to-original-position-on-second-drag
//https://stackoverflow.com/questions/41638032/how-to-pass-data-between-child-and-parent-in-react-native

class Png extends React.Component {
    constructor(props) {
        super(props)
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
           onStartShouldSetPanResponder: () => true,
           onPanResponderMove: (event, gesture) => {
               if (((gesture.moveX - 32) > 0) && ((gesture.moveX + 32) < config.canvasWidth) && ((gesture.moveY - config.headerHeight - 42) > 32) && (gesture.moveY < (config.canvasHeight + config.headerHeight + 16))) {
                   position.setValue({ x: gesture.dx, y: gesture.dy })
                   this.setState({
                       coords: {
                           x: Math.floor(gesture.moveX),
                           y: Math.floor(gesture.moveY - config.headerHeight - 58)
                       }
                   })
               }
           },
           onPanResponderGrant: (event, gesture) => {
               this.state.position.setOffset({x: this.state.position.x._value, y: this.state.position.y._value});
               this.state.position.setValue({x: 0, y: 0})
           },
           onPanResponderRelease: (event, {vx, vy}) => {
               this.state.position.flattenOffset()
               this.props.updateCoords(this.state.coords) //If you don't call this function within onPanResponderRelease (i.e. if you call it in your render function above return) you'll get the error from SendMessage "Invariant Violation: Maximum update depth exceeded. This can happen when a component repeatedly calls setState..." because it will be calling this.props.updateCoords incessantly which is, in turn, calling setState. For some reason it doesn't like setState being nested in a function that's being called from another component.
           }
        })
        this.state = {
            panResponder: panResponder,
            position: position,
            coords: {}
        }
    }

   render() {
       let handlers = this.state.panResponder.panHandlers
      return (
        <Animated.View style={this.state.position.getLayout()} {...handlers}>
            <Text numberOfLines={6} style={{textDecorationLine: this.props.selected && this.props.words !== '' ? 'underline' : 'none', textAlign: 'center', color: 'rgb(215,215,215)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: 32, fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.words}</Text>
        </Animated.View>
      )
   }
}

export default Png
