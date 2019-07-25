import React from 'react'
import { View, PanResponder, Animated, Text } from 'react-native'
import config from '../../config'

//https://medium.com/@leonardobrunolima/react-native-tips-using-animated-and-panresponder-components-to-interact-with-user-gestures-4620bf27b9e4
//https://codedaily.io/tutorials/1/Maintain-Touchable-Items-with-a-Parent-PanResponder-in-React-Native
//https://stackoverflow.com/questions/42014379/panresponder-snaps-animated-view-back-to-original-position-on-second-drag

class Png extends React.Component {
    constructor(props) {
        super(props)
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
           onStartShouldSetPanResponder: () => true,
           onPanResponderMove: (event, gesture) => {
               position.setValue({ x: gesture.dx, y: gesture.dy })
           },
           onPanResponderGrant: (event, gesture) => {
               this.state.position.setOffset({x: this.state.position.x._value, y: this.state.position.y._value});
               this.state.position.setValue({x: 0, y: 0})
           },
           onPanResponderRelease: (event, {vx, vy}) => {
               this.state.position.flattenOffset()
           }
        })
        this.state = { panResponder, position };
    }

   render() {
       let handlers = this.state.panResponder.panHandlers
      return (
         <Animated.View style={[{width: config.screenWidth * .9}, this.state.position.getLayout()]} {...handlers}>
            <Text numberOfLines={6} style={{textAlign: 'center', color: 'rgb(215,215,215)', textShadowColor: 'rgb(0,0,0)', textShadowRadius: 3, padding: 3, fontSize: 32, fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.words}</Text>
         </Animated.View>
      )
   }
}

export default Png
