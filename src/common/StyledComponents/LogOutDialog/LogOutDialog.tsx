import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import colours from '../../../common/constants/styles.json'
import { MMKV } from 'react-native-mmkv';
import reloadApp from '../../functionUtils/reloadApp';

interface LogOutDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogOutDialog: React.FC<LogOutDialogProps> = ({ visible, onCancel, onConfirm }) => {

  return (
    <Modal statusBarTranslucent visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onCancel}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Are you sure you want to logout?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonStyle} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle} onPress={onConfirm}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.85,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    margin: 16
  },
  modalText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: colours['theme-color'],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colours['theme-color'],
    padding: 10,
    borderRadius: 5,
    // marginRight: 10,
  },
  confirmButton: {
    backgroundColor: colours['theme-color'],
    padding: 10,
    borderRadius: 5,
  },
  buttonStyle: {
    padding: 8,
    borderWidth: 1,
    borderColor: 'hotpink',
    borderRadius: 8,
    maxWidth: 100,
    width: 80,
    alignItems: 'center'
  },
  buttonText: {
    color: 'black', fontSize: 16, fontWeight: 'normal'
  },
});

export default LogOutDialog;
