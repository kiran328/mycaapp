import React, { FC } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface RadioButtonProps {
    selected: any;
    onPress: any;
}
const RadioButton: FC<RadioButtonProps> = ({ selected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
            <View
                style={{
                    height: 20,
                    width: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selected ? 'green' : '#C0C0C0',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {selected ? (
                    <View
                        style={{
                            height: 10,
                            width: 10,
                            borderRadius: 5,
                            backgroundColor: 'green',
                        }}
                    />
                ) : null}
            </View>
        </TouchableOpacity>
    );
};

export default RadioButton;
