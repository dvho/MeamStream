import contants from '../constants'

export default {
    userReceived: (user) => {
        return {
            type: contants.USER_RECEIVED,
            data: user
        }
    }
}
