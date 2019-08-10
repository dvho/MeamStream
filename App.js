import React from 'react'
import { AsyncStorage, ActivityIndicator, YellowBox } from 'react-native'
import { Home, Authenticate, Conversation, Profile } from './src/components/screens'
import config from './src/config'
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation'

import { Zocial, Ionicons } from '@expo/vector-icons'

YellowBox.ignoreWarnings([
  'Require cycle:',
])

const MessageStack = createStackNavigator({
    home: Home,
    conversation: Conversation
},
//Everything commented out here is declared ad hoc in each screen component
// {
//     defaultNavigationOptions: {
//         headerStyle: {
//             backgroundColor: config.colors.main
//         },
//         headerTintColor: 'rgb(255,255,255)',
//         headerTitleStyle: {
//             fontWeight: 'bold',
//             color: 'rgb(255,255,255)',
//         }
//     }
// }
)

const MainAppTabs = createBottomTabNavigator({
    messages: MessageStack,
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
            authed: false
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
        return(
            this.state.authChecked ? <Switch/> : <ActivityIndicator size='large'/>
        )
    }
}

export default App
