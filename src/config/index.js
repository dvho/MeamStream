import { Dimensions } from 'react-native'
import { Header } from 'react-navigation'

export default {
    turboAppId: '5d050e1a272e860015c2fe89',
    baseUrl: 'https://private-messenger-02-tvartj.turbo360-vertex.com/',
    //baseUrl: 'http://localhost:3000',
    userIdKey: 'logged_in_user',
    colors: {
        main: 'rgb(64,64,64)', //Old one rgb(28,132,250)
        inactiveButton: 'rgb(215,215,215)',
        activeButton: 'rgb(187,17,23)',
        failButton: 'rgb(210,210,0)',


        dormantButton: 'rgb(128,128,128)',
        toggleSearching: 'rgb(207,23,23)',
        toggleArranging: 'rgb(0,0,179)',
        selectingButton: 'rgb(163,163,15)',
        selectedButton: 'rgb(122,122,255)',
        sendButton: 'rgb(182,182,255)',
        scrollButton: 'rgba(182,255,182,.7)'
    },
    screenWidth: Dimensions.get('window').width,
    headerHeight: Header.HEIGHT,
    images: {
        theaterPng: require('../assets/theater.png'),
        //countdownVid: 'https://media.giphy.com/media/thNsW0HZ534DC/giphy.gif' //Pulling this video from giphy on load is about 6MB! the (higher res countdown.mp4 is only 0.4MB)
    },
    videos: {
        countdownMp4: require('../assets/countdown.mp4'),
        waitingMp4: require('../assets/waiting.mp4')
    }
}
