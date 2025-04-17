import React, { FC, useCallback, useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, ScrollView, FlatList, RefreshControl, Modal, Dimensions, ToastAndroid } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Header from '../../common/StyledComponents/Header';
import styles from './PersonalDiaryStyles'
import colours from '../../common/constants/styles.json'
import translate from '../../context/Translations';
import AddNote from '../../../assets/svg/addNote';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import HealthWorkerPNG from '../../../assets/lottie/winter-traveler.json';
import LoadingSpinner from '../../../assets/lottie/loading.json';
import { setNoteDetails } from '../../redux/actions';
import CustomModal from '../../common/StyledComponents/PuzzleModals/PuzzleModal';
import { formatDate } from '../../common/functionUtils/functionUtils';
import { RootState } from '../../redux/rootReducer';
import VerticalEllipses from '../../../assets/svg/verticalEllipses';
import { useQuery, useQueryClient } from 'react-query';
import { deletePersonalNote, getDiaryNotes } from '../../common/apis/api';
import Delete from '../../../assets/svg/delete';
import Back from '../../../assets/svg/back';

interface DiaryListProps { }

interface Notes {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

const DiaryList: FC<DiaryListProps> = () => {

    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const navigation: any = useNavigation();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [diaryDetails, setDiaryDetails] = useState<any[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showPopover, setShowPopover] = useState<boolean>(false);
    const [noteToDelete, setNoteToDelete] = useState<number | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });

    const noteDetails: any = useSelector((state: RootState) => state.app.noteDetails);

    const deleteNote = diaryDetails.find((note: any) => note.id === noteToDelete);

    useQuery({
        queryKey: ["personalDiary"],
        queryFn: getDiaryNotes,
        // refetchInterval: 5000,
        onSuccess(response) {
            if (response.data) {
                const notes = response.data.results
                setDiaryDetails(notes);
            }
        }
    });

    useFocusEffect(
        useCallback(() => {
            queryClient.invalidateQueries("personalDiary");
        }, [])
    );

    const handleEllipsesPress = (event: any, id: number) => {
        const { pageX, pageY } = event.nativeEvent;
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;

        // Pop-Over dimensions
        const popoverWidth = 120; // Adjust based on your Pop-Over width
        const popoverHeight = 150; // Adjust based on your Pop-Over height

        // Adjust horizontal position
        let adjustedLeft = pageX;
        if (pageX + popoverWidth > screenWidth) {
            adjustedLeft = screenWidth - popoverWidth - 5; // Add some padding from the edge
        }

        // Adjust vertical position
        let adjustedTop = pageY;
        if (pageY + popoverHeight > screenHeight) {
            adjustedTop = screenHeight - popoverHeight - 5; // Add some padding from the edge
        }

        setPopoverPosition({ top: adjustedTop, left: adjustedLeft });
        setShowPopover(true);
        setNoteToDelete(id);
    };


    const goToWellBeing = () => {
        navigation.navigate('WellBeing');
    };

    const navigateToNotes = (note: any) => {
        navigation.navigate('PersonalDiary');
    };

    const handleLongNotePress = (id: number) => {
        setNoteToDelete(id);
        setShowModal(true);
    }

    const renderChapterItem = ({ item }: { item: Notes }) => {
        const formatDate = (dateString: string) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });
        };
        return (
            <TouchableOpacity
                key={item.id}
                style={styles.chapterItem}
                onLongPress={() => handleLongNotePress(item.id)}
                onPress={() => {
                    navigateToNotes(item);
                    dispatch(setNoteDetails(item));
                }}>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    marginLeft: 24
                }}>
                    <Text
                        style={{ color: 'black', fontSize: 18, fontWeight: '500', flex: 1 }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.title}
                    </Text>
                    <Text style={{ color: 'gray', fontSize: 16, fontWeight: '500' }}>
                        {formatDate(item?.created_at)}
                    </Text>
                </View>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                    right: 0
                }}>
                    <TouchableOpacity onPress={(e) => handleEllipsesPress(e, item.id)}>
                        <VerticalEllipses />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            queryClient.invalidateQueries("personalDiary");
        } catch (error) {
            console.error("Error refreshing daily activity:", error);
        } finally {
            setRefreshing(false);
        }
    }, []);


    const handleAddNotePress = () => {
        dispatch(setNoteDetails({
            ...noteDetails,
            id: null,
            title: '',
            content: '',
        }));
        navigation.navigate('PersonalDiary');
    }

    const handleDeleteNote = async () => {
        try {
            const response = await deletePersonalNote(deleteNote?.id);
            if (response && response.data) {
                setShowPopover(false);
                setShowModal(false)
                queryClient.invalidateQueries("personalDiary");
                ToastAndroid.show("Note Deleted!", ToastAndroid.SHORT);
            }
        } catch (err) {
            console.error("Error deleting the note!", err);
            ToastAndroid.show("Something went wrong! Try again.", ToastAndroid.SHORT);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colours['theme-backgroung-color'] }}>
            <Header
                title={translate('PersonalDiary')}
                headerBackgroundColor={colours['theme-color']}
                statusBarBackgroundColor={colours['theme-color']}
                showBackButton={true}
                leftIcon={<Back />}
                onLeftIconPress={goToWellBeing}
            />
            <View style={styles.container}>
                {diaryDetails?.length === 0 ? (
                    <View style={styles.NodataLottie}>
                        {/* <LottieView source={LoadingSpinner} style={styles.lottieStyles} autoPlay loop /> */}
                        <Text style={styles.textStyle}>
                            Click
                        </Text>
                        <AddNote height={25} width={25} />
                        <Text style={styles.textStyle}>
                            to start your diary
                        </Text>
                    </View>
                ) : (
                    <>
                        <FlatList
                            data={diaryDetails}
                            showsVerticalScrollIndicator={false}
                            style={styles.chapterList}
                            renderItem={renderChapterItem}
                            keyExtractor={(item) => item.id.toString()}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    </>
                )}
                <View style={{
                    position: 'absolute',
                    right: 32,
                    bottom: 32
                }}>
                    <TouchableOpacity onPress={handleAddNotePress}>
                        <AddNote height={65} width={65} />
                    </TouchableOpacity>
                </View>
            </View>

            <CustomModal visible={showModal} onRequestClose={() => setShowModal(false)}>
                <View style={styles.modal}>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        marginBottom: 16,
                        width: '100%',
                        alignItems: 'center',
                        gap: 16
                    }}>
                        <Text style={styles.heading}>Do you want to delete {deleteNote?.title} ?</Text>
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '100%',
                        alignItems: 'center',
                        gap: 16
                    }}>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <Text style={{
                                fontSize: 16,
                                color: 'blue',
                                fontWeight: '500'
                            }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeleteNote}>
                            <Text style={{
                                fontSize: 16,
                                color: 'red',
                                fontWeight: '500'
                            }}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CustomModal>

            {showPopover && (
                <Modal transparent={true} statusBarTranslucent animationType="fade" visible={showPopover}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setShowPopover(false)}
                    >
                        <View style={[styles.popover, { top: popoverPosition.top, left: popoverPosition.left }]}>
                            <TouchableOpacity onPress={() => {
                                setShowPopover(false);
                                setShowModal(true)
                            }}
                                style={styles.popoverItem}
                            >
                                <Text style={styles.popOverText}>
                                    Delete
                                </Text>
                                <Delete height={25} width={25} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    )
}

export default DiaryList
