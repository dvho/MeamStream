import React from 'react'
import { View, PanResponder, Animated, Text } from 'react-native'
import config from '../../config'

//https://medium.com/@leonardobrunolima/react-native-tips-using-animated-and-panresponder-components-to-interact-with-user-gestures-4620bf27b9e4
//https://codedaily.io/tutorials/1/Maintain-Touchable-Items-with-a-Parent-PanResponder-in-React-Native
//https://stackoverflow.com/questions/42014379/panresponder-snaps-animated-view-back-to-original-position-on-second-drag
//https://stackoverflow.com/questions/41638032/how-to-pass-data-between-child-and-parent-in-react-native
//TODO: Need to make coords update set upon componentDidMount otherwise it'll pass undefined if user doesn't drag content

class Png extends React.Component {
    constructor(props) {
        super(props)
        const position = new Animated.ValueXY()
        const panResponder = PanResponder.create({
           onStartShouldSetPanResponder: () => true,
           onPanResponderMove: (event, gesture) => { //For the conditional statement and function below one could grab x and y locations from the View's onLayout properties but then the gestures themselves wouldn't work for some reason.
               if (((gesture.moveX - event.nativeEvent.locationX - 5) > 0) && ((gesture.moveX - event.nativeEvent.locationX + this.state.textWidth - 5) < config.canvasWidth ) && ((gesture.moveY - event.nativeEvent.locationY - config.headerHeight - 42) > 0) && ((gesture.moveY - event.nativeEvent.locationY + this.state.textHeight - 42) < (config.canvasHeight + config.headerHeight))) {

                       position.setValue({ x: gesture.dx, y: gesture.dy })
                       this.setState({
                           coords: {
                               x: (gesture.moveX - event.nativeEvent.locationX - 5) / config.canvasWidth,
                               y: (gesture.moveY - event.nativeEvent.locationY - config.headerHeight - 42) / config.canvasHeight
                           },
                           outOfRange: false
                       })

               } else {
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
               setTimeout(()=>this.props.updateCoords(this.state.coords), 5) //If you don't call this function within onPanResponderRelease (i.e. if you call it in your render function above return) you'll get the error from SendMessage "Invariant Violation: Maximum update depth exceeded. This can happen when a component repeatedly calls setState..." because it will be calling this.props.updateCoords incessantly which is, in turn, calling setState. For some reason it doesn't like setState being nested in a function that's being called from another component. Also, if you don't break the chain with a setTimeout it'll update with coordinates from the release before.
           }
        })
        this.state = {
            panResponder: panResponder,
            position: position,
            coords: {},
            outOfRange: false
        }
        this.onLayout = this.onLayout.bind(this)
    }
    onLayout = (e) => {
        this.setState({
            textWidth: e.nativeEvent.layout.width,
            textHeight: e.nativeEvent.layout.height,
            //x: e.nativeEvent.layout.x,
            //y: e.nativeEvent.layout.y //You can grab x and y values here but since they're also being grabbed by PanResponder and since PanResponder gesture method doesn't seem to work without it's own values there's no need to set them in state here, just wanted to demo how it would look in a future case so leaving it as commented out.
        })
    }

   render() {
       let handlers = this.state.panResponder.panHandlers
      return (
        <Animated.View onLayout={this.onLayout} style={this.state.position.getLayout()} {...handlers}>
            <Text numberOfLines={6} style={{textDecorationLine: this.props.selected && this.props.words !== '' ? 'underline' : 'none', textAlign: 'center', color: this.state.outOfRange ? 'rgb(0,0,0)' : 'rgb(243,243,243)', textShadowColor: this.state.outOfRange ? 'rgb(243,243,243)' : 'rgb(0,0,0)', textShadowRadius: this.state.outOfRange ? 12: 3, padding: this.state.outOfRange ? 12 : 3, fontSize: (((config.screenWidth - 11)/10)- 4), fontWeight: 'bold', fontStyle: 'italic'}}>{this.props.words}</Text>
        </Animated.View>
      )
   }
}

export default Png
