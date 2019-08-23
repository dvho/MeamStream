export default {
    userReceived: (user) => {
        return {
            type: 'USER_RECEIVED',
            data: user
        }
    },
    recipientFromAddressBook: (recipient) => {
        return {
            type: 'RECIPIENT_FROM_ADDRESS_BOOK',
            data: recipient
        }
    }
}
