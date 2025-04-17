import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    display: 'flex',
    flexDirection: 'row',
    padding: 1,
    backgroundColor: 'skyblue',
    margin: 8,
    borderRadius: 5,
    elevation: 5
  },
  tabItem: {
    flexDirection: 'row', // Ensure items are displayed horizontally
    alignItems: 'center',
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  profileContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  lottieStyles: {
    height: 160,
    width: 160
  },
  webViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoOverlay: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  videoPlay: {
    color: 'white',
    height: 52,
    width: 52,
    fontSize: 50,
    alignItems: 'center',
  },

  videoWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 4,
  },
  videoWrapperSpecialText: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: 4,
    //height:150,
  },
  videoControlWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  isCompleteMark: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
    top: 13,
    right: 8
  }
});

export default styles