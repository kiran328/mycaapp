import React, { FC, useEffect, useRef, useState } from 'react';
import analytics from '@react-native-firebase/analytics';
import { DefaultTheme, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';
import PostHog, { usePostHog, PostHogProvider } from 'posthog-react-native'

// import SplashScreen from 'react-native-splash-screen';
import Dashboard from './src/components/Dashboard/Dashboard';
import Courses from './src/components/Courses/Courses';
import Login from './src/components/Login/Login';
import ProfileSelection from './src/components/ProfileSelection/ProfileSelection';
import Chapters from './src/components/Chapters/Chapters';
import ChapterParts from './src/components/ChapterParts/ChapterParts';
import VerifyOTP from './src/components/Login/VerifyOTP/VerifyOTP';
import { RootState } from './src/redux/rootReducer';
import { MMKV } from 'react-native-mmkv';
import { setIsAuthenticated } from './src/redux/actions';
import WelcomeScreen from './src/components/InitialScreens/WelcomeScreen';
import DailyActivity from './src/components/DailyActivity/DailyActivity';
import Themes from './src/components/Themes/Themes';
import Puzzle from './src/components/Puzzle/Puzzle';
import PuzzleList from './src/components/PuzzleList/PuzzleList';
import Quiz from './src/components/QuizElement/Quiz';
import Summary from './src/components/ChapterParts/Summary/Summary';
import WellBeing from './src/components/WellBeing/WellBeing';
import GuidedMeditation from './src/components/GuidedMeditation/GuidedMeditation';
import MoodCalender from './src/components/MoodCalender/MoodCalender';
import Helpline from './src/components/Helpline/Helpline';
import BreathingCompanion from './src/components/BreathingCompanion/BreathingCompanionList';
import BreathingExercise from './src/components/BreathingCompanion/BreathingExercise/BreathingExercise';
import GuidedExercise from './src/components/GuidedExercise/GuidedExerciseList';
import GuidedExerciseSteps from './src/components/GuidedExercise/GuidedExercise';
import PersonalDiary from './src/components/PersonalDiary/PersonalDiary';
import DiaryList from './src/components/PersonalDiary/DiaryList';
import SelfAssessmentList from './src/components/SelfAssessment/SelfAssessmentList';
import Assessment from './src/components/SelfAssessment/Assessment';
import { Dimensions, Linking, Text, View } from 'react-native';
import color from './src/common/constants/styles.json'
import LogOutDialog from './src/common/StyledComponents/LogOutDialog/LogOutDialog';
import DrawerNavigator from './DrawerNavigator';
import translate from './src/context/Translations';
import Homes from './assets/svg/settingsicons/home.svg'
import Settings from './assets/svg/settingsicons/settings.svg'
import Feedbacks from './assets/svg/settingsicons/feedback.svg'
import Aboutus from './assets/svg/settingsicons/aboutus.svg'
import FAQs from './assets/svg/settingsicons/faq.svg'
import AboutUs from './src/components/AboutUs/AboutUs';
import FAQ from './src/components/FAQ/FAQ';
import Notification from './src/components/NotificationPanel/NotificationPanel';
import Reminder from './src/components/Reminder/Reminder';
import ChatComponent from './src/components/ChatWithMYCA/ChatWithMYCA';

interface AppProps { }

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



const AppNavigator: FC<AppProps> = () => {
    const dispatch = useDispatch();
    const routeNameRef = useRef<any>(null);
    const navigationRef = useRef<any>(null);
    const posthog = new PostHog('phc_6b2xR6CP4VCExEMhHcbcq9hOrR1JlCCpeAKTI7Pdd3n');

    let selectedLanguage: any = useSelector((state: RootState) => state.app.language);
    const isAuthenticated: boolean = useSelector((state: RootState) => state.app.isAuthenticated);
    const userInfo = useSelector((state: RootState) => state.app.userInfo);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // SplashScreen.hide();

        const storage = new MMKV();
        const token = storage.getString('token');
        if (token) {
            dispatch(setIsAuthenticated(true));
        } else {
            dispatch(setIsAuthenticated(false));
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (userInfo && userInfo.user_id) {
            posthog.identify(userInfo.user_id.toString(), {
                name: userInfo.name,
                user_id: userInfo.user_id,
            });
        }
    }, [userInfo]);    

    if (isLoading) {
        // You can return a loading spinner or null while loading
        return null;
    }

    return (
        <NavigationContainer
            theme={DefaultTheme}
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;

                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                routeNameRef.current = currentRouteName;
            }}
        >
            <PostHogProvider apiKey="phc_6b2xR6CP4VCExEMhHcbcq9hOrR1JlCCpeAKTI7Pdd3n" options={{
                host: "https://us.i.posthog.com",
            }}>
                {isAuthenticated ? (
                    <Drawer.Navigator
                        screenOptions={{
                            headerShown: false,
                            drawerStyle: {
                                backgroundColor: color['theme-backgroung-color'], // Change background color
                                width: Dimensions.get('screen').width * 0.8
                            },
                            drawerLabelStyle: {
                                fontWeight: 'bold',
                                fontSize: 16,
                                color: 'black',
                            },
                            drawerActiveTintColor: 'blue'
                        }}
                        drawerContent={(props) => <DrawerNavigator {...props} />}>
                        <Drawer.Screen
                            options={{
                                drawerIcon: () => (
                                    <Homes />
                                )
                            }}
                            name={selectedLanguage === 'mr' ? 'होम' : 'Home'}
                            component={AppStack}
                        />
                        <Drawer.Screen
                            options={{
                                drawerIcon: () => (
                                    <FAQs />
                                )
                            }}
                            name={selectedLanguage === 'mr' ? 'एफ.ए.क्यु' : 'F.A.Q'}
                            component={FAQ}
                        />
                        <Drawer.Screen
                            options={{
                                drawerIcon: () => (
                                    <Aboutus />
                                )
                            }}
                            name={selectedLanguage === 'mr' ? 'आमची माहिती' : 'About Us'}
                            component={AboutUs}
                        />
                        {/* <Drawer.Screen
                        options={{
                            drawerIcon: () => (
                                <Feedbacks />
                            )
                        }}
                        name={selectedLanguage === 'mr' ? 'अभिप्राय' : 'Feedback'}
                        component={Feedback}
                    /> */}
                    </Drawer.Navigator>
                ) : (
                    <AuthStack />
                )}
            </PostHogProvider>
        </NavigationContainer>
    );
};

const AppStack: FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                    title: 'Dashboard Screen',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Courses"
                component={Courses}
                options={{
                    title: 'Courses',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Chapters"
                component={Chapters}
                options={{
                    title: 'Chapters List',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Chapter Parts"
                component={ChapterParts}
                options={{
                    title: 'Chapter Parts',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Themes"
                component={Themes}
                options={{
                    title: 'Themes',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PuzzleList"
                component={PuzzleList}
                options={{
                    title: 'PuzzleList',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Puzzle"
                component={Puzzle}
                options={{
                    title: 'Puzzle',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Daily Activity"
                component={DailyActivity}
                options={{
                    title: 'Daily Activity',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Quiz"
                component={Quiz}
                options={{
                    title: 'Quiz',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Summary"
                component={Summary}
                options={{
                    title: 'Summary',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="WellBeing"
                component={WellBeing}
                options={{
                    title: 'My Mental Well Being',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="GuidedMeditation"
                component={GuidedMeditation}
                options={{
                    title: 'Guided Meditation',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="MoodCalender"
                component={MoodCalender}
                options={{
                    title: 'Mood Calender',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="BreathingCompanion"
                component={BreathingCompanion}
                options={{
                    title: 'Breathing Companion',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="BreathingExercise"
                component={BreathingExercise}
                options={{
                    title: 'Breathing Exercise',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Helpline"
                component={Helpline}
                options={{
                    title: 'Helpline',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="GuidedExercise"
                component={GuidedExercise}
                options={{
                    title: 'Breathing Companion',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ExerciseSteps"
                component={GuidedExerciseSteps}
                options={{
                    title: 'Breathing Exercise',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PersonalDiary"
                component={PersonalDiary}
                options={{
                    title: 'PersonalDiary',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DiaryList"
                component={DiaryList}
                options={{
                    title: 'DiaryList',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SelfAssessmentList"
                component={SelfAssessmentList}
                options={{
                    title: 'SelfAssessmentList',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Assessment"
                component={Assessment}
                options={{
                    title: 'Assessment',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Notifications"
                component={Notification}
                options={{
                    title: 'Notification',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Reminder"
                component={Reminder}
                options={{
                    title: 'Reminder',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ChatComponent"
                component={ChatComponent}
                options={{
                    title: 'Chat',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

const AuthStack: FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="WelcomeScreen"
                component={WelcomeScreen}
                options={{
                    title: 'Welcome Screen',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ProfileSelection"
                component={ProfileSelection}
                options={{
                    title: 'Profile Selection',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    title: 'Login Screen',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="OTP"
                component={VerifyOTP}
                options={{
                    title: 'Verify OTP',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
