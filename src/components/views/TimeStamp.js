import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import dateFormat from 'dateformat'

const TimeStamp = props => {

    const dateTime = props.props
    const date = dateFormat(dateTime, "fullDate").split(', ')
    const time = dateFormat(dateTime, "shortTime")

        return(
            <View style={styles.dateTimeBlock}>
                <Text>{date[0].slice(0,3)}</Text>
                <Text>{date[1]}</Text>
                <Text>{time}</Text>
            </View>
        )
}

const styles = StyleSheet.create({
    dateTimeBlock: {
        alignItems: 'flex-end'
    }
})

export default TimeStamp
