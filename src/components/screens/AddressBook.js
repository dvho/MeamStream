import React from 'react'
import { View, Image, Text, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
//import { SingleContact } from '../views'
//import actions from '../../redux/actions'
import config from '../../config'

class AddressBook extends React.Component {
    constructor() {
        super()
        this.state = {
            test: 'test'
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Image source={config.images.backgroundTilePng} resizeMode='repeat' resizeMethod='scale' style={{position: 'absolute', width: config.screenWidth, height: config.screenWidth * 2}}/>
                <Text>{this.state.test}</Text>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: 100 + '%',
        height: 100 + '%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AddressBook
