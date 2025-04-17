import React, { FC, useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/rootReducer';
import { setCategoryList, setGenderList, setUserInfo } from '../../../redux/actions';
import { useQuery } from 'react-query';
import { getGenderList, getSubCategory } from '../../apis/api';
import { Dropdown } from 'react-native-element-dropdown';
import { MultiSelect } from 'react-native-element-dropdown';

interface EditNameProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}


const EditName: FC<EditNameProps> = ({ visible, onCancel, onConfirm }) => {
    const dispatch = useDispatch();

    const user: any = useSelector((state: RootState) => state.app.userInfo);
    const categoryList: any = useSelector((state: RootState) => state.app.categoryList);
    const genderList: any = useSelector((state: RootState) => state.app.genderList);

    const [selectedGender, setSelectedGender] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

    useQuery({
        queryKey: ["userCategory"],
        queryFn: getSubCategory,
        onSuccess(response) {
            if (response.data && response.data.response.length > 0) {
                const sortedCategories = response.data.response.sort((a: { name: string }, b: { name: string }) => {
                    const order: { [key: string]: number } = {
                        Teacher: 1,
                        Headmaster: 2,
                    };
                    return (order[a.name] || 999) - (order[b.name] || 999);
                });
    
                dispatch(setCategoryList(sortedCategories));
            }
        }
    });

    useQuery({
        queryKey: ["userGender"],
        queryFn: getGenderList,
        onSuccess(response) {
            if (response.data && response.data.response.length > 0) {
                dispatch(setGenderList(response.data.response));
            }
        }
    });

    useEffect(() => {
        const categories = user.sub_category?.split(',').map(Number)
        // Check if `user.sub_category` (name) exists and the category list is loaded
        if (categories?.length > 0 && categoryList?.length > 0) {
            // Find the category where the name matches `user.sub_category`
            const matchedCategory = categoryList?.find((cat: any) => cat.name === categories);
            // If a matching category is found, set the `selectedCategory` to its id
            if (matchedCategory) {
                dispatch(setUserInfo({ ...user, sub_category: matchedCategory.id }));
            }
        }
    }, []);

    useEffect(() => {
        const categories = user.sub_category?.split(',').map(Number)

        if (categories?.length > 0 && categoryList?.length > 0) {
            const matchedCategories = categoryList
                ?.filter((cat: any) => categories?.includes(cat.id))
                ?.map((cat: any) => cat.id);
            setSelectedCategory(matchedCategories);
        }
    }, [user, categoryList]);

    const handleNameChange = (value: string) => {
        dispatch(setUserInfo({ ...user, name: value }));
    };

    const handleEmailChange = (value: string) => {
        dispatch(setUserInfo({ ...user, email: value }));
    };

    const handleGenderChange = (value: any) => {
        setSelectedGender(value);
        dispatch(setUserInfo({ ...user, gender: value.id }));
    };

    const handleCategoryChange = (value: any) => {
        setSelectedCategory((prev) => {
            if (prev.includes(value)) {
                // Remove the item if it is already selected
                return prev.filter((item) => item !== value);
            } else {
                // Add the item if it is not selected
                return [...prev, value];
            }
        });
        dispatch(setUserInfo({ ...user, sub_category: value.toString() }));
    };

    return (
        <Modal
            transparent
            statusBarTranslucent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.input}
                        value={user.name}
                        placeholder="Name"
                        placeholderTextColor="gray"
                        onChangeText={handleNameChange}
                        autoFocus
                    />
                    <TextInput
                        style={styles.input}
                        value={user.email}
                        placeholder="Email (optional)"
                        placeholderTextColor="gray"
                        onChangeText={handleEmailChange}
                    />

                    <Dropdown
                        style={styles.dropdown}
                        itemTextStyle={styles.selectedTextStyle}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={genderList}
                        disable={!user.is_editable}
                        placeholder="Select Gender"
                        value={selectedGender || user.gender}
                        onChange={handleGenderChange}
                        labelField="gender_name"
                        valueField="id"
                    />

                    <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        itemTextStyle={styles.selectedTextStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={categoryList}
                        disable={!user.is_editable}
                        labelField="name"
                        valueField="id"
                        placeholder="Select Category"
                        searchPlaceholder="Search..."
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        selectedStyle={styles.selectedStyle}
                        activeColor="lightgrey"
                    />

                    <View style={styles.modalButtonContainer}>
                        <TouchableOpacity onPress={onConfirm} style={styles.buttonStyle}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'normal' }}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCancel} style={styles.buttonStyle}>
                            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'normal' }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        fontSize: 20,
        color: 'black',
        width: '100%',
        marginBottom: 20,
        padding: 5,
    },
    modalButtonContainer: {
        marginTop: 8,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonStyle: {
        padding: 8,
        borderWidth: 1,
        borderColor: 'hotpink',
        borderRadius: 8,
        maxWidth: 100,
        width: 80,
        alignItems: 'center',
    },
    selectButton: {
        padding: 10,
        backgroundColor: 'lightgray',
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    dropdown: {
        width: '100%',
        height: 50,
        color: 'black',
        backgroundColor: 'transparent',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },
    placeholderStyle: {
        fontSize: 18,
        color: '#666',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: 'black'
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    selectedStyle: {
        borderRadius: 12,
    },
});

export default EditName;
