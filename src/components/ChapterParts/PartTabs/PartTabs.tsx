import React, { FC, useEffect, useState } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import colours from '../../../common/constants/styles.json';
import { useDispatch, useSelector } from 'react-redux';
import { setChapterId, setChapterTimer, setShowSummary } from '../../../redux/actions';
import translate from '../../../context/Translations';
import { RootState } from '../../../redux/rootReducer';
import { addChapterSummary } from '../../../common/apis/api';

interface CustomTabProps {
    tabs: any[];
    activeTab: any;
    onChange: (tab: any) => void;
}

const PartTab: FC<CustomTabProps> = ({ tabs, activeTab, onChange }) => {
    const [timer, setTimer] = useState<number>(0);
    
    const dispatch = useDispatch();
    const chapterId: any = useSelector((state: RootState) => state.app.chapterId);
    const chapterTimer: any = useSelector((state: RootState) => state.app.chapterTimer);

    const handleSummaryPress = async () => {
        dispatch(setChapterTimer(timer));
        dispatch(setChapterId(chapterId));
        await addSummary();
        onChange('summary');
        dispatch(setShowSummary(true));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => {
            clearInterval(interval); // Stop timer on component unmount
        };
    }, []);

    const addSummary = async () => {
        try {
            await addChapterSummary(Number(chapterId), Number(chapterTimer));
        } catch (err) {
            console.error("Error sending summary", err)
        }
    }

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={{
                        backgroundColor: colours['theme-color'],
                        borderCurve: 'circular',
                        borderColor: 'gray',
                        paddingHorizontal: 25,
                        marginTop: 16,
                        marginLeft: 8,
                        marginRight: index === tabs.length - 1 ? 8 : 6,
                        marginBottom: 6,
                        borderRadius: 22,
                        paddingVertical: 10,
                        elevation: activeTab === tab ? 2 : 0,
                        borderBottomColor: activeTab === tab ? 'black' : 'gray',
                    }}
                    onPress={() => onChange(tab)}
                >
                    <Text style={{
                        fontSize: 16,
                        color: activeTab === tab ? 'black' : 'gray',
                        fontWeight: activeTab === tab ? '700' : '400'
                    }}>
                        {translate("Part")} {index + 1}
                    </Text>
                </TouchableOpacity>
            ))}
            {/* Summary Button */}
            {tabs.length !== 0 && <TouchableOpacity
                onPress={handleSummaryPress}
                style={{
                    backgroundColor: colours['theme-color'],
                    borderCurve: 'circular',
                    borderColor: 'gray',
                    paddingHorizontal: 25,
                    marginTop: 16,
                    marginLeft: 6,
                    marginRight: 16,
                    marginBottom: 6,
                    borderRadius: 22,
                    paddingVertical: 10,
                    elevation: activeTab === 'summary' ? 2 : 0,
                    borderBottomColor: activeTab === 'summary' ? 'black' : 'gray',
                }}
            >
                <Text style={{
                    fontSize: 16,
                    color: activeTab === 'summary' ? 'black' : 'gray',
                    fontWeight: activeTab === 'summary' ? '700' : '400'
                }}>
                    {translate("Summary")}
                </Text>
            </TouchableOpacity>}
        </ScrollView>
    );
};

export default PartTab;
