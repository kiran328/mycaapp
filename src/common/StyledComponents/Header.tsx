import React from 'react';
import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TextTicker from 'react-native-text-ticker';

interface CustomHeaderProps {
    title: string;
    headerBackgroundColor: string;
    statusBarBackgroundColor: string;
    showBackButton?: boolean;
    onLeftIconPress?: () => void;
    showLogoutButton?: boolean;
    onRightIconPress?: () => void;
    leftIcon?: any;
    rightIcon?: any;
    showPercent?: any;
}

const Header: React.FC<CustomHeaderProps> = ({
    title,
    headerBackgroundColor,
    statusBarBackgroundColor,
    onLeftIconPress,
    showLogoutButton = false,
    onRightIconPress,
    leftIcon,
    rightIcon,
    showPercent
}) => {
    const styles = StyleSheet.create({
        statusbarStyle: {
            backgroundColor: statusBarBackgroundColor,
        },
        headerContainerStyle: {
            width: '100%',
            height: 50,
            backgroundColor: headerBackgroundColor,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: 16,
            paddingRight: showLogoutButton ? 16 : 0, // Add right padding if logout button is shown
        },
        backButton: {
            left: 0,
            marginLeft: 2,
        },
        logoutButton: {
            right: 0, // Pushes the button to the right
            marginRight: 10,
        },
        titleStyle: {
            width: Dimensions.get('window').width * 0.7,
            fontFamily: 'Urbanist-Regular',
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 16,
        },
    });

    const insets = useSafeAreaInsets();
    
    const renderBackButton = () => {
        if (leftIcon) {
            return (
                <TouchableOpacity style={styles.backButton} onPress={onLeftIconPress}>
                    {leftIcon}
                </TouchableOpacity>
            );
        }
        return null;
    };

    const renderLogoutButton = () => {
        if (rightIcon && onRightIconPress) {
            return (
                <TouchableOpacity style={styles.logoutButton} onPress={onRightIconPress}>
                    {rightIcon}
                </TouchableOpacity>
            );
        }
        return null;
    };

    return (
        <SafeAreaView style={{ paddingTop: insets.top, backgroundColor: statusBarBackgroundColor }}>
            <StatusBar backgroundColor={statusBarBackgroundColor} barStyle="dark-content" />
            <View style={styles.headerContainerStyle}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {renderBackButton()}
                    <TextTicker
                        style={styles.titleStyle}
                        // duration={10000}
                        scrollSpeed={50}
                        loop
                        bounce={false}
                        repeatSpacer={50}
                        marqueeDelay={100}>
                        {title}
                    </TextTicker>
                </View>
                <View>
                    {showPercent ?
                        <Text style={{ fontSize: 20, fontWeight: '700', color: 'black', marginRight: 16 }}>{showPercent}</Text>
                        : renderLogoutButton()}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Header;