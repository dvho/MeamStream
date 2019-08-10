import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, StatusBar, AsyncStorage } from 'react-native'
import config from '../../config'

class Profile extends React.Component {

    logout() {
        AsyncStorage.removeItem(config.userIdKey)
        .then(removed => {
            this.props.navigation.navigate('auth')
        })
    }

    render() {

        return(
            <View style={styles.container}>

                <StatusBar barStyle='dark-content'/>

                <Text style={[styles.texts, styles.dropShadows]}>My Profile</Text>

                <TouchableOpacity onPress={() => this.logout()} activeOpacity={0.1} style={{padding: 15, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.texts, styles.dropShadows]}>Logout</Text>

                </TouchableOpacity>

            </View>
        )
    }
}

const styles = {
    container: {
        width: 100 + '%',
        height: 100 + '%',
        paddingTop: 60,
        display: 'flex',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: config.colors.main
    },
    texts: {
        fontSize: 36,
        color: 'rgb(255,255,255)'
    },
    dropShadows: {
        textShadowColor: 'rgb(0,0,0)',
        shadowOpacity: .5,
        shadowRadius: 2,
        shadowOffset: {width: 12, height: 12}
    }
}


export default Profile
