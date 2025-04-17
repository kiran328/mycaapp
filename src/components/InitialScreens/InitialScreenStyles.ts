import { StyleSheet } from "react-native";
import colours from '../../common/constants/styles.json'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginScreenInput: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    padding: 16,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderBottomWidth: 0,
    borderWidth: 1,
    borderTopLeftRadius: 32,
    gap: 32,
    borderTopRightRadius: 32,
  },
  languageButtons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileNumberContiner: {
    width: '100%'
  },
  mobileNumberInput: {
    width: '100%',
    borderBottomWidth: 2,
    borderWidth: 2,
    backgroundColor: 'white',
    borderColor: colours['theme-color'],
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 55,
  },
  loginImage: {
    marginTop: 26,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  divider: {
    width: '75%',
    height: 1.5, 
    backgroundColor: 'black', 
    marginBottom: 16,  
  },
  verifyOTPButton: {
    width: '45%',
    margin: 8,
    padding: 12,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: 20,
    backgroundColor: colours['language-buttons'],
    borderRadius: 12,
    elevation: 2
  },
  loginButton: {
    width: '60%',
    margin: 8,
    padding: 16,
    height: 64,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    gap: 20,
    backgroundColor: colours['theme-color'],
    borderRadius: 32,
    elevation: 4,
  },
  borderStyleBase: {
    width: 30,
    height: 45
  },
  borderStyleHighLighted: {
    borderColor: "#03DAC6",
  },
  OTPFieldStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 60,
    fontSize: 32,
    borderWidth: 1,
    borderRadius: 8,
    color: 'black',
    marginRight: 20,
    marginLeft: -10,
    borderColor: colours['theme-color'],
    backgroundColor: 'white'
  },

  OTPHightLightStyle: {
    borderColor: colours['theme-color'],
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
})

export default styles;