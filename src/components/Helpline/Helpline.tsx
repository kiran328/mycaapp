import React, { FC, useState } from 'react';
import { View, Text, Linking, ToastAndroid, Modal, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import colour from '../../common/constants/styles.json';
import translate from '../../context/Translations';
import CustomerSupport from '../../../assets/lottie/customer-support.json';
import LottieView from 'lottie-react-native';
import styles from './HelplineStyles.module';
import { TouchableOpacity } from 'react-native';
import PhoneIcon from '../../../assets/svg/phoneIcon';
import WhatsappIcon from '../../../assets/svg/whatsappIcon';
import { useQuery } from 'react-query';
import { getHelplineDetails } from '../../common/apis/api';
import Back from '../../../assets/svg/back';

interface HelplineProps { }

const Helpline: FC<HelplineProps> = () => {

    const navigation: any = useNavigation();
    const [helplineDetails, setHelplineDetails] = useState<any>([]);
    const [showModal, setShowModal] = useState<boolean>(false);

    const goToDashboard = () => {
        navigation.navigate('Dashboard');
    };

    useQuery({
        queryKey: ["appVersion"],
        queryFn: getHelplineDetails,
        onSuccess(response) {
            if (response.data) {
                setHelplineDetails(response.data.response);
            }
        }
    });

    const handlePress = async (url: string, type: string) => {
        try {
            if (type === 'phone') {
                setShowModal(true);
            } else {
                await Linking.openURL(url);
            }
        } catch (error) {
            ToastAndroid.show(`Failed to open ${type === 'phone' ? 'call' : 'WhatsApp'}! Try again.`, ToastAndroid.SHORT);
        }
    };

    const handleNumberPress = async (url: string) => {
        await Linking.openURL(url);
    };

    const renderHelplineItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handleNumberPress(item.number)} style={[styles.item, { margin: 8, width: Dimensions.get('window').width * 0.42 }]}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemNumber}>{item.number.replace('tel:', '')}</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: colour['theme-backgroung-color'] }}>
            <Header
                title={translate("Helpline")}
                headerBackgroundColor={colour['theme-color']}
                statusBarBackgroundColor={colour['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={goToDashboard}
            />
            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={styles.profileContainer}>
                    <LottieView source={CustomerSupport} style={styles.lottieStyles} autoPlay loop />
                </View>
                <View style={styles.container}>
                    <View style={styles.contactStyle}>
                        <TouchableOpacity onPress={() => handlePress(helplineDetails?.phone_number, "phone")}>
                            <PhoneIcon />
                        </TouchableOpacity>
                        <Text style={[styles.text, { backgroundColor: 'purple' }]}>Emergency Helpline</Text>
                    </View>
                    <View style={styles.contactStyle}>
                        <TouchableOpacity onPress={() => handlePress(helplineDetails?.whatsapp, 'whatsApp')}>
                            <WhatsappIcon height={90} width={90} />
                        </TouchableOpacity>
                        <Text style={[styles.text, { backgroundColor: 'violet' }]}>Whatsapp Support</Text>
                    </View>
                </View>
            </View>
            <Modal visible={showModal} statusBarTranslucent animationType="fade" transparent onRequestClose={() => setShowModal(false)}>
                <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={() => setShowModal(false)}>
                    <View style={styles.modalContent}>
                        {helplineDetails?.phone_number?.length >= 4 ? (
                            <FlatList
                                data={helplineDetails?.phone_number}
                                renderItem={renderHelplineItem}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'center' }}
                            />
                        ) : (
                            helplineDetails?.phone_number?.map((helpline: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => handleNumberPress(helpline.number)}
                                    style={styles.item}
                                >
                                    <Text style={styles.itemText}>{helpline.name}</Text>
                                    <Text style={styles.itemNumber}>{helpline.number.replace('tel:', '')}</Text>
                                    <Text style={styles.descriptionText}>{helpline.description}</Text>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default Helpline;
