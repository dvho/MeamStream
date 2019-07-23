import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import config from '../../config'

class GiphyOption extends React.PureComponent {

    render() {

        return(
            <TouchableOpacity onPress={this.props.getGiphyId} style={{width: config.screenWidth, heigh: 100 + '%', justifyContent: 'center', alignItems: 'center', backgroundColor: config.inactiveButton}}>

                <Image style={{width: 100 + '%', height: 100 + '%'}} source={{uri: `https://media.giphy.com/media/${this.props.gifId}/200w_d.gif`}} resizeMode='contain' resizeMethod='resize'/>

            </TouchableOpacity>
        )
    }
}

export default GiphyOption
