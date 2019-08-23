var initalState = {}

export default(state = initalState, action) => {
    let newState = Object.assign({}, state)
    switch(action.type){
        case 'USER_RECEIVED':
            newState.user = action.data
            return newState
        case 'RECIPIENT_FROM_ADDRESS_BOOK':
            newState.recipient = action.data
            return newState
        default:
            return state
    }
}
