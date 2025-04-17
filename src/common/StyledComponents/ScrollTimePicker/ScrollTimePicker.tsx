import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useDispatch } from 'react-redux';
import { setExerciseTimer } from '../../../redux/actions';
import color from '../../../common/constants/styles.json'

const ITEM_HEIGHT = 50; // Height of each item
const SCREEN_HEIGHT = Dimensions.get('window').height;

const ScrollTimerPicker = ({ showHours = true, showMinutes = true, showSeconds = true }) => {
    const dispatch = useDispatch();

    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(1);
    const [selectedSecond, setSelectedSecond] = useState(0);

    useEffect(() => {
        dispatch(setExerciseTimer({
            hour: selectedHour,
            minute: selectedMinute,
            second: selectedSecond
        }))
    }, [selectedHour, selectedMinute, selectedSecond])

    const hours = Array.from({ length: 24 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i + 1);
    const seconds = Array.from({ length: 60 }, (_, i) => i + 1);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>, setSelected: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const index = Math.round(offsetY / ITEM_HEIGHT) + 1;
        setSelected(index);
    };

    const renderItem = (item: any, selectedValue: number) => (
        <View style={styles.itemContainer}>
            <Text style={[styles.itemText, item === selectedValue && styles.selectedItemText]}>
                {item < 10 ? `0${item}` : item} min
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {showHours && (
                <FlatList
                    data={hours}
                    renderItem={({ item }) => renderItem(item, selectedHour)}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={styles.list}
                    onScroll={(event) => handleScroll(event, setSelectedHour)}
                />
            )}
            {showMinutes && (
                <FlatList
                    data={minutes}
                    renderItem={({ item }) => renderItem(item, selectedMinute)}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={styles.list}
                    onScroll={(event) => handleScroll(event, setSelectedMinute)}
                />
            )}
            {showSeconds && (
                <FlatList
                    data={seconds}
                    renderItem={({ item }) => renderItem(item, selectedSecond)}
                    keyExtractor={(item) => item.toString()}
                    showsVerticalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    contentContainerStyle={styles.list}
                    onScroll={(event) => handleScroll(event, setSelectedSecond)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.2,
        width: Dimensions.get('window').width * 0.75,
        borderRadius: 16,
        zIndex: 5
    },
    list: {
        alignItems: 'center',
        paddingVertical: (SCREEN_HEIGHT / 2.75 - ITEM_HEIGHT) / 4.5,
    },
    itemContainer: {
        height: ITEM_HEIGHT,
        justifyContent: 'center',
    },
    itemText: {
        fontSize: 18,
    },
    selectedItemText: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'blue'
    },
});

export default ScrollTimerPicker;
