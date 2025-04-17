import React, { FC, useCallback, useState } from 'react'
import { View, Text, Button, TouchableOpacity, FlatList, RefreshControl, Linking, Dimensions, ToastAndroid } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import colours from '../../common/constants/styles.json'
import Header from '../../common/StyledComponents/Header';
import Back from '../../../assets/svg/back';
import translate from '../../context/Translations';
import { useQuery, useQueryClient } from 'react-query';
import { getNotifications } from '../../common/apis/api';
import styles from './NotificationsStyle';
import LottieView from 'lottie-react-native';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import FastImage from 'react-native-fast-image';
import Link from '../../../assets/svg/settingsicons/link.svg'
import { format, parseISO } from 'date-fns';
import InAppBrowser from 'react-native-inappbrowser-reborn';

interface NotificationsProps { }

interface Notification {
    id: number;
    heading: string;
    content: string;
    url: string;
    image_url: string;
    created_at: string;
}

const Notification: FC<NotificationsProps> = () => {

    const navigation: any = useNavigation();
    const queryClient = useQueryClient();

    const [notificationsList, setNotificationsList] = useState<any>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const gotoDashboard = () => {
        navigation.navigate('Dashboard');
    };

    useQuery({
        queryKey: ["notificationList"],
        queryFn: getNotifications,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                setNotificationsList(response.data.response)
            }
        }
    });

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("notificationList");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, [queryClient]);

    const openUrl = async (url: string) => {
        try {
            if (await InAppBrowser.isAvailable()) {
                await InAppBrowser.open(url, {
                    toolbarColor: colours['theme-color'],
                    enableDefaultShare: false,
                });
            }
        } catch (err) {
            ToastAndroid.show("Failed to open Link!", ToastAndroid.SHORT);
        }
    }

    const RenderNotifications: FC<{ item: Notification }> = React.memo(({ item }) => {
        const formattedDate = item?.created_at ? format(parseISO(item.created_at), 'dd MMM yyyy hh:mm a') : null;

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.notificationItem}
                onPress={() => openUrl(item?.url)}
                disabled={!item?.url}
            >
                <View style={styles.notificationText}>
                    <View style={styles.textContainer}>
                        <Text style={{ color: 'black', fontSize: 20, fontWeight: '500' }}>
                            {item?.heading?.length > 25 ? `${item?.heading?.substring(0, 25)}...` : item?.heading}
                        </Text>
                        {item?.url && <Link />}
                    </View>
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'normal' }}>
                        {item?.content}
                    </Text>
                </View>
                {item?.image_url && <FastImage
                    style={{
                        height: Dimensions.get('window').height * 0.25,
                        width: Dimensions.get('window').width * 0.9,
                        borderRadius: 5,
                        marginBottom: 4
                    }}
                    source={{ uri: item?.image_url }}
                    resizeMode={FastImage.resizeMode.cover}
                />}
                {item?.created_at ? (
                    <View style={{
                        position: 'absolute',
                        bottom: 4,
                        right: 8
                    }}>
                        <Text style={{ color: 'black', fontSize: 10, fontWeight: 'normal' }}>
                            {formattedDate}
                        </Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    });


    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate('Notifications')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={gotoDashboard}
            />
            {notificationsList.length === 0 ? (
                <View style={styles.NodataLottie}>
                    <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop />
                </View>
            ) : (
                <>
                    <FlatList
                        data={notificationsList}
                        showsVerticalScrollIndicator={false}
                        style={styles.chapterList}
                        renderItem={({ item }) => <RenderNotifications item={item} />}
                        keyExtractor={(item) => item?.id?.toString()}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        updateCellsBatchingPeriod={50}
                    />
                </>
            )}
        </View>
    )
}

export default Notification
