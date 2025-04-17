import React, { FC } from 'react'
import { View, Text, Button } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Header from '../../../common/StyledComponents/Header';

interface ChaptersProps { }

const Advance: FC<ChaptersProps> = () => {

    const navigation: any = useNavigation();

    const goToCourses = () => {
        navigation.navigate('Courses');
    };

    return (
        <View>
            <Text>Advance</Text>
        </View>
    )
}

export default Advance
