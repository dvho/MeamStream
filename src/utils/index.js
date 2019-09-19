import config from '../config'
import { AsyncStorage } from 'react-native'
const queryString = require('query-string')

export default {

    fetchMessages: (endpoint, additionalQueryParams) => {

        let params = {}
        Object.keys(additionalQueryParams).forEach((key, i) => {
            params[key] = additionalQueryParams[key]
        })
        return AsyncStorage.getItem(config.userIdKey)
        .then(key => {
            params.toUser = key
            let query = queryString.stringify(params)

            //console.log(query)

            //alert(JSON.stringify(query))

            return fetch(`${config.baseUrl}api/${endpoint}?${query}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                }
        })
        .then(response => {
            //console.log(response)
            return response.json()
            })
        })
    },

    createMessages: (additionalParams) => {
        let params = {}
        Object.keys(additionalParams).forEach((key, i) => {
            params[key] = additionalParams[key]
        })
        return AsyncStorage.getItem(config.userIdKey)
        .then(key => {
            params.fromUser = key

            return fetch(`${config.baseUrl}api/message`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(params)
        })
        .then(response => {
            return response.json()
            })
            .catch(err => {
                alert('Sorry ' + err.message)
            })
        })
    },

    filterAndSortMessagesByDate: (arrayOfMessages, filter) => {

        let filteredArray = []

        //console.log(filter)
        //console.log(arrayOfMessages)


        if ((filter !== undefined) && (filter !== [])) {
            arrayOfMessages.forEach(i => {
                if (!filter.includes(i.id)) {
                    filteredArray.push(i)
                }
            })
        } else {
            filteredArray = arrayOfMessages
        }

        filteredArray.sort((a,b) => {
            return new Date(b.timestamp) - new Date(a.timestamp)
        })
        return filteredArray
    },

    mostRecentMessagePerSender: (arrayOfMessages) => {
        const senderArray = []
        const mostRecentMessagePerSenderArray = []
        arrayOfMessages.forEach(i => {
            if (!senderArray.includes(i.fromUser)) {
                senderArray.push(i.fromUser)
            }
        })
        arrayOfMessages.forEach(i => {
            if(senderArray.includes(i.fromUser)) {
                mostRecentMessagePerSenderArray.push(i)
                senderArray.shift()
            }
        })
        return mostRecentMessagePerSenderArray
    }

}
