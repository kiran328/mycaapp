import React from 'react';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface ThemeDescription {
    visible: boolean;
    onRequestClose?: () => void;
    children: React.ReactNode;
}

const CustomModal: React.FC<ThemeDescription> = ({ visible, onRequestClose, children }) => {
    return (
        <Modal statusBarTranslucent visible={visible} transparent animationType="fade">
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onRequestClose}>
                <View style={styles.modalContainer}>
                    {children}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 1,
        borderRadius: 16,
        elevation: 5,
        height: 'auto',
        margin: 24
    },
    // Add your other styles here
});

export default CustomModal;
