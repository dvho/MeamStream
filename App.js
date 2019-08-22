import React from 'react'
import { AsyncStorage, ActivityIndicator, YellowBox } from 'react-native'
import { Asset } from 'expo-asset'
import { AppLoading } from 'expo'
import { Home, Authenticate, Conversation, Profile, AddressBook } from './src/components/screens'
import config from './src/config'
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation'
import store from './src/redux/stores'
import { Provider } from 'react-redux'

import { Zocial, Ionicons } from '@expo/vector-icons'

YellowBox.ignoreWarnings([
  'Require cycle:',
])

const MessageStack = createStackNavigator({
    home: Home,
    conversation: Conversation
})

const MainAppTabs = createBottomTabNavigator({
    messages: MessageStack,
    addressBook: AddressBook,
    profile: Profile
},
{
    defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const routeName = navigation.state.routeName
            let IconComponent
            let iconName
            if (routeName === 'profile') {
                iconName = 'md-person'
                IconComponent = Ionicons
            } else if (routeName === 'messages') {
                iconName = 'email'
                IconComponent = Zocial
            } else if (routeName === 'addressBook') {
                iconName = 'email'
                IconComponent = Zocial
            }
        return <IconComponent name={iconName} size={25} color={tintColor} />
        },
    }),

    tabBarOptions: {
      activeTintColor: config.colors.blue,
      inactiveTintColor: '#ccc',
    },

    //Everything commented out here is declared ad hoc in each screen component
    // headerStyle: {
    //     backgroundColor: config.colors.main
    // },
    //
    // headerTintColor: 'rgb(255,255,255)',
    //
    // headerTitleStyle: {
    //     fontWeight: 'bold',
    //     color: 'rgb(255,255,255)',
    // },
    tabBarPosition: 'bottom'
})



const rootNav = (authBoolean) => {
    return(
        createAppContainer(createSwitchNavigator({
            main: MainAppTabs,
            auth: Authenticate
        },
        {
            initialRouteName: (authBoolean) ? 'main' : 'auth'
        }))
    )
}


class App extends React.Component {

    constructor() {
        super()
        this.state = {
            authChecked: false,
            authed: false,
            isReady: false
        }
    }

    componentDidMount() {
        return AsyncStorage.getItem(config.userIdKey)
        .then(key => {
            if (key) {
                this.setState({
                    authChecked: true,
                    authed: true
                })
            } else {
                this.setState({
                    authChecked: true
                })
            }
        })
        .catch(err => {
            alert(err)
        })
        //AsyncStorage.removeItem(config.userIdKey)
    }

    render() {
        const Switch = rootNav(this.state.authed)
        if (!this.state.isReady) {
            return (
                <AppLoading startAsync={this._cacheResourcesAsync} onFinish={() => this.setState({isReady: true})} onError={console.warn}/>
            )
        }
        return(
            this.state.authChecked ? <Provider store={store.configureStore()}><Switch/></Provider> : <ActivityIndicator size='large'/>
        )
    }

    async _cacheResourcesAsync() {
        const images = [require('./src/assets/logo.png'), require('./src/assets/curtain.png'), require('./src/assets/theater.png'), require('./src/assets/countdown.mp4'), require('./src/assets/logoName.png'), require('./src/assets/backgroundTile.png'), require('./src/assets/waiting.mp4')]
        const cacheImages = images.map(image => {
            return Asset.fromModule(image).downloadAsync()
        })
        return Promise.all(cacheImages)
    }
}

export default App
