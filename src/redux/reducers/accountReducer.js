import constants from '../constants'

var initalState = {}

export default(state = initalState, action) => {
    let newState = Object.assign({}, state)
    switch(action.type){
        case constants.USER_RECEIVED:
            newState.user = action.data
            return newState
        default:
            return state
    }
}
