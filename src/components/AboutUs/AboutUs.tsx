import React, { FC, useState } from 'react'
import { View, Text, Button, ScrollView, Dimensions, TouchableOpacity, Linking, Share, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import translate from '../../context/Translations';
import colours from '../../common/constants/styles.json'
import Back from '../../../assets/svg/back';
import { Marquee } from '@animatereactnative/marquee';
import FastImage from 'react-native-fast-image';
import styles from './AboutusStyle';

import Mail from '../../../assets/svg/settingsicons/mail.svg';
import Youtube from '../../../assets/svg/settingsicons/youtube.svg';
import Website from '../../../assets/svg/settingsicons/website.svg';
import Instagram from '../../../assets/svg/settingsicons/instagram.svg';
import Donate from '../../../assets/svg/settingsicons/donate.svg';
import { Divider } from '@rneui/themed';
import { useQuery } from 'react-query';
import { getAboutUsInfo } from '../../common/apis/api';
import ShareIcon from '../../../assets/svg/share';
import InAppBrowser from 'react-native-inappbrowser-reborn';

interface AboutUsProps { }

const AboutUs: FC<AboutUsProps> = () => {

    const navigation: any = useNavigation();
    const [data, setData] = useState<any>({})

    useQuery({
        queryKey: ["aboutUs"],
        queryFn: getAboutUsInfo,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data && response.status === 200) {
                setData(response.data.response)
            }
        }
    })

    const gotToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    const MarqueeComponent = () => (
        data?.supporters?.map((sponsor: any, idx: number) => (
            <View
                key={idx}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 4,
                    backgroundColor: 'white',
                    borderColor: '#C0C0C0',
                    borderWidth: 0.5,
                    borderRadius: 8,
                    height: Dimensions.get("screen").height * 0.2,
                    width: Dimensions.get("screen").width * 0.3,
                    padding: 8,
                    margin: 8
                }}>
                <FastImage source={{ uri: sponsor.image }} style={{ height: 100, width: 100 }} />
                <Text style={{ textAlign: 'center', color: 'black', fontWeight: 'normal' }}>{sponsor.name}</Text>
            </View>
        )))

    const shareContent = async () => {
        try {
            await Share.share({
                message: data.hyperlinks.share,
                // url: 'https://example.com',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Header
                title={translate('AboutUs')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={gotToDashboard}
            />
            <ScrollView style={{ flex: 1, marginHorizontal: 8 }} showsVerticalScrollIndicator={false}>


                <View style={[styles.containers, { marginBottom: 16 }]}>
                    <FastImage
                        source={{ uri: data?.intro?.image }}
                        style={{ height: Dimensions.get('window').height * 0.25, width: Dimensions.get('window').width * 0.75 }}  // Specify a fixed width
                        resizeMode={FastImage.resizeMode.contain}  // Maintain aspect ratio within the container
                    />

                    <Text style={[styles.textStyle, { fontSize: 16, marginVertical: 16 }]}>
                        {data?.intro?.text}
                    </Text>
                </View>

                <View style={[styles.containers, { marginBottom: 16 }]}>
                    <TouchableOpacity style={[styles.containers, { position: 'relative' }]} onPress={async () => {
                        // Linking.openURL(data?.hyperlinks?.donate)
                        try {
                            if (await InAppBrowser.isAvailable()) {
                                await InAppBrowser.open(data.vopa.website, {
                                    toolbarColor: colours['theme-color'],
                                    enableDefaultShare: false,
                                });
                            }
                        } catch (err) {
                            ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                        }
                    }}>
                        <FastImage
                            source={{ uri: data?.vopa?.image }}
                            style={{ height: Dimensions.get('window').height * 0.25, width: Dimensions.get('window').width * 0.75 }}  // Specify a fixed width
                            resizeMode={FastImage.resizeMode.contain}  // Maintain aspect ratio within the container
                        />
                        <Text style={{ color: 'blue' }}>Visit Website</Text>
                    </TouchableOpacity>

                    <Text style={[styles.textStyle, { fontSize: 16, marginVertical: 16 }]}>
                        {data?.vopa?.text}
                    </Text>
                </View>

                <View style={[styles.containers, { marginVertical: 8 }]}>
                    <TouchableOpacity style={[styles.containers, { position: 'relative', marginBottom: 8 }]} onPress={async () => {
                        // Linking.openURL(data?.hyperlinks?.donate)
                        try {
                            if (await InAppBrowser.isAvailable()) {
                                await InAppBrowser.open(data.parivartan.website, {
                                    toolbarColor: colours['theme-color'],
                                    enableDefaultShare: false,
                                });
                            }
                        } catch (err) {
                            ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                        }
                    }}>
                        <FastImage
                            source={{ uri: data?.parivartan?.image }}
                            style={{ height: Dimensions.get('window').height * 0.25, width: Dimensions.get('window').width * 0.75 }}  // Specify a fixed width
                            resizeMode={FastImage.resizeMode.contain}  // Maintain aspect ratio within the container
                        />
                        <Text style={{ color: 'blue' }}>Visit Website</Text>
                    </TouchableOpacity>

                    <Text style={[styles.textStyle, { fontSize: 16, marginBottom: 8 }]}>
                        {data?.parivartan?.text}
                    </Text>
                </View>

                <View style={[styles.containers, { marginBottom: 16 }]}>
                    <Text style={[styles.textStyle, { fontSize: 16, marginBottom: 8 }]}>Supported by</Text>
                    <View style={styles.flexRow}>
                        {data?.is_marquee ?
                            <Marquee style={{ width: Dimensions.get('window').width }} spacing={20} speed={1}>
                                <MarqueeComponent />
                            </Marquee> :
                            <MarqueeComponent />
                        }
                    </View>
                </View>

                <View style={[styles.containers, { marginBottom: 16 }]}>
                    <Text style={[styles.textStyle, { fontSize: 16, marginBottom: 8 }]}>Your support is equally appreciated!</Text>

                    <View style={styles.flexRow}>
                        <TouchableOpacity style={[styles.flexRow, {
                            backgroundColor: 'hotpink',
                            borderRadius: 4,
                            padding: 4,
                            gap: 4,
                            elevation: 1,
                            width: '50%'
                        }]}
                            onPress={async () => {
                                // Linking.openURL(data?.hyperlinks?.donate)
                                try {
                                    if (await InAppBrowser.isAvailable()) {
                                        await InAppBrowser.open(data?.hyperlinks?.donate, {
                                            toolbarColor: colours['theme-color'],
                                            enableDefaultShare: false,
                                        });
                                    }
                                } catch (err) {
                                    ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                                }
                            }}
                        >
                            <Text style={[styles.textStyle, { color: 'white', fontSize: 18 }]}>Donate Here!</Text>
                            <Donate />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.flexColumn, {
                            borderRadius: 4,
                            padding: 25
                        }]}
                            onPress={shareContent}
                        >
                            <ShareIcon />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={[styles.containers, { marginBottom: 16 }]}>
                    <Text style={[styles.textStyle, { fontSize: 16, marginBottom: 8 }]}>Write us or Follow us on</Text>
                    <ScrollView contentContainerStyle={styles.socialContainer} horizontal={true}>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(data?.hyperlinks?.mail)}
                        >
                            <Mail />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => {
                            // Linking.openURL(data?.hyperlinks?.donate)
                            try {
                                if (await InAppBrowser.isAvailable()) {
                                    await InAppBrowser.open(data?.hyperlinks?.insta, {
                                        toolbarColor: colours['theme-color'],
                                        enableDefaultShare: false,
                                    });
                                }
                            } catch (err) {
                                ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                            }
                        }}
                        >
                            <Instagram />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                // Linking.openURL(data?.hyperlinks?.donate)
                                try {
                                    if (await InAppBrowser.isAvailable()) {
                                        await InAppBrowser.open(data?.hyperlinks?.youtube, {
                                            toolbarColor: colours['theme-color'],
                                            enableDefaultShare: false,
                                        });
                                    }
                                } catch (err) {
                                    ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                                }
                            }}
                        >
                            <Youtube />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                // Linking.openURL(data?.hyperlinks?.donate)
                                try {
                                    if (await InAppBrowser.isAvailable()) {
                                        await InAppBrowser.open(data?.hyperlinks?.website, {
                                            toolbarColor: colours['theme-color'],
                                            enableDefaultShare: false,
                                        });
                                    }
                                } catch (err) {
                                    ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
                                }
                            }}
                        >
                            <Website />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </ScrollView >
        </View >
    )
}

export default AboutUs
