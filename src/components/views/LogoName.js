import React from 'react'
import { View, Image } from 'react-native'
import config from '../../config'


class LogoName extends React.Component {
  render() {
    return (
        <View style={{width: 100 + '%'}}>
            <Image source={config.images.logoNamePng} style={{left: 20, width: 400/900 * config.screenWidth, height: 200/900 * config.screenWidth}}/>
        </View>
    );
  }
}

export default LogoName
