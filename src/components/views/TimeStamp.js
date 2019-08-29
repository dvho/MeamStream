import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import dateFormat from 'dateformat'

const TimeStamp = props => {

    const timeStampInMilliseconds = Date.parse(props.timestamp)
    const currentTimeInMilliseconds = props.currentTimeInMilliseconds
    const millisecondsSinceMidnight = props.millisecondsSinceMidnight

    const dateTime = props.timestamp
    const date = dateFormat(dateTime, "fullDate").split(', ')
    const time = dateFormat(dateTime, "shortTime")
    const wasItOverADayAgo = (millisecondsSinceMidnight - (currentTimeInMilliseconds - timeStampInMilliseconds)) < 0
    const wasItOverTwoDaysAgo = ((86400000 + millisecondsSinceMidnight) - (currentTimeInMilliseconds - timeStampInMilliseconds)) < 0
    const wasItOverAWeekAgo = ((518400000 + millisecondsSinceMidnight) - (currentTimeInMilliseconds - timeStampInMilliseconds)) < 0

        return(
            <View style={styles.dateTimeBlock}>

                { props.oneLineStamp ?
                    <Text style={props.dateTimeFont}>{`${wasItOverADayAgo ? (wasItOverAWeekAgo ? date[1] : (wasItOverTwoDaysAgo ? date[0].slice(0,3) : 'yesterday')) : 'today'} ${time}`}</Text>
                 :
                 <View>
                    <Text style={props.dateTimeFont}>{wasItOverADayAgo ? (wasItOverAWeekAgo ? date[1] : (wasItOverTwoDaysAgo ? date[0].slice(0,3) : 'yesterday')) : 'today'}</Text>
                    <Text style={props.dateTimeFont}>{time}</Text>
                </View>}

            </View>
        )
}

const styles = StyleSheet.create({
    dateTimeBlock: {
        alignItems: 'flex-end'
    }
})

export default TimeStamp
