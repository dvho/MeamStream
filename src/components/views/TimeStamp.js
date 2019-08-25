import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import dateFormat from 'dateformat'

const TimeStamp = props => {

    const dateTime = props.timestamp
    const date = dateFormat(dateTime, "fullDate").split(', ')
    const time = dateFormat(dateTime, "shortTime")

        return(
            <View style={styles.dateTimeBlock}>
                <Text style={props.dateTimeFont}>{date[0].slice(0,3)}</Text>
                <Text style={props.dateTimeFont}>{date[1]}</Text>
                <Text style={props.dateTimeFont}>{time}</Text>
            </View>
        )
}

const styles = StyleSheet.create({
    dateTimeBlock: {
        alignItems: 'flex-end'
    }
})

export default TimeStamp
