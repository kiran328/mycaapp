import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export type RepeatMode = 'noRepeat' | 'repeatTrack' | 'repeatPlaylist';

interface Pattern {
  id: string;
  title: string;
  image_url: string;
  description: string;
  mode: string
}

interface Exercise {
  id: string;
  title: string;
  description: string;
}

interface ExerciseTimer {
  hour: number;
  minute: number;
  second: number;
}

interface NotesDetails {
  id: number | null;
  title: string;
  content: string;
  created_at: string;
}

interface AssessmentDetails {
  id: number | null;
  title: string;
  tagline: string;
  image: string;
}

interface EditName {
  isEditing: boolean;
  name: string;
}

interface UserInfo {
  user_id: any;
  name: string;
  number: string
  email: string;
  gender: string;
  sub_category: any;
  isActive: boolean;
  chatBotLink: string;
  isEditing: boolean;
}

interface Wallpapers{
  DASHBOARD: string;
  WELLBEING: string;
  DAILYACTIVITY: string;
  PUZZLETHEME: string;
  PUZZLES: string;
  COURSE: string;
  CHAPTER: string;
}

interface AppState {
  language: string | null;
  isAuthenticated: boolean;
  courseId: string | null;
  courseName: string | null;
  chapterId: string | null;
  partId: string | null;
  chapterTitle: string | null;
  themeId: string | null;
  themeName: string | null;
  themeDescription: string | null;
  puzzleId: string | null;
  puzzleName: string | null;
  selectedProfile: number | null;
  mobileNumber: number | null;
  OTPNumber: number | null;
  responseOTP: number | null;
  isPlaying: boolean;
  chapterTimer: any;
  showSummary: boolean;
  playlist: any;
  showMeditationPlayer: boolean;
  currentTrackIndex: any;
  isRepeat: RepeatMode;
  isShuffle: boolean;
  breathingDetails: any;
  timer: any;
  isAnimationRunning: boolean;
  isPaused: boolean;
  exerciseDetails: Exercise;
  noteDetails: NotesDetails;
  assessmentDetails: AssessmentDetails
  editName: EditName;
  userInfo: UserInfo;
  categoryList: any;
  genderList: any;
  wallpapers: Wallpapers;
}

const initialState: AppState = {
  language: null,
  isAuthenticated: false,
  courseId: null,
  courseName: null,
  chapterId: null,
  partId: null,
  chapterTitle: null,
  themeId: null,
  themeName: null,
  themeDescription: null,
  puzzleId: null,
  puzzleName: null,
  selectedProfile: null,
  mobileNumber: null,
  OTPNumber: null,
  responseOTP: null,
  isPlaying: true,
  chapterTimer: null,
  showSummary: false,
  playlist: null,
  showMeditationPlayer: false,
  currentTrackIndex: null,
  isRepeat: 'noRepeat',
  isShuffle: false,
  breathingDetails: { id: '', title: '', image_url: '', description: '', mode: '' },
  timer: { hour: 0, minute: 0, second: 0 },
  isAnimationRunning: false,
  isPaused: false,
  exerciseDetails: { id: '', title: '', description: '' },
  noteDetails: { id: null, title: '', content: '', created_at: '' },
  assessmentDetails: { id: null, title: '', tagline: '', image: '' },
  editName: { isEditing: false, name: '' },
  userInfo: { user_id: null, name: '', number: '', email: '', gender: '', sub_category: '', isActive: false, chatBotLink: '', isEditing: false },
  categoryList: [],
  genderList: [],
  wallpapers: {
    DASHBOARD: '',
    WELLBEING: '',
    DAILYACTIVITY: '',
    PUZZLETHEME: '',
    PUZZLES: '',
    COURSE: '',
    CHAPTER: ''
  }
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage(state: any, action: PayloadAction<string>) {
      state.language = action.payload;
    },

    setIsAuthenticated(state: any, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },

    setCourseId(state: any, action: PayloadAction<string>) {
      state.courseId = action.payload;
    },

    setCourseName(state: any, action: PayloadAction<string>) {
      state.courseName = action.payload;
    },

    setPartId(state: any, action: PayloadAction<string>) {
      state.partId = action.payload;
    },

    setChapterId(state: any, action: PayloadAction<string>) {
      state.chapterId = action.payload;
    },

    setChapterTitle(state: any, action: PayloadAction<string>) {
      state.chapterTitle = action.payload;
    },

    setThemeId(state: any, action: PayloadAction<number>) {
      state.themeId = action.payload;
    },

    setThemeName(state: any, action: PayloadAction<string>) {
      state.themeName = action.payload;
    },

    setThemeDescription(state: any, action: PayloadAction<string>) {
      state.themeDescription = action.payload;
    },

    setPuzzleId(state: any, action: PayloadAction<number>) {
      state.puzzleId = action.payload;
    },

    setPuzzleName(state: any, action: PayloadAction<string>) {
      state.puzzleName = action.payload;
    },

    setSelectedProfile(state: any, action: PayloadAction<number>) {
      state.selectedProfile = action.payload;
    },

    setMobileNumber(state: any, action: PayloadAction<number | null>) {
      state.mobileNumber = action.payload;
    },

    setResponseOTP(state: any, action: PayloadAction<number>) {
      state.responseOTP = action.payload;
    },

    setOTPNumber(state: any, action: PayloadAction<number>) {
      state.OTPNumber = action.payload;
    },

    setIsPlaying(state: any, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },

    setChapterTimer(state: any, action: PayloadAction<any>) {
      state.chapterTimer = action.payload;
    },

    setShowSummary(state: any, action: PayloadAction<boolean>) {
      state.showSummary = action.payload;
    },

    setPlaylist(state: any, action: PayloadAction<any>) {
      state.playlist = action.payload;
    },

    setShowMeditationPlayer(state: any, action: PayloadAction<boolean>) {
      state.showMeditationPlayer = action.payload;
    },

    setCurrentTrackIndex(state: any, action: PayloadAction<any>) {
      state.currentTrackIndex = action.payload;
    },

    setIsRepeat(state: any, action: PayloadAction<RepeatMode>) {
      state.isRepeat = action.payload;
    },

    setIsShuffle(state: any, action: PayloadAction<boolean>) {
      state.isShuffle = action.payload;
    },
    setElementTimer(state: any, action: PayloadAction<any>) {
      state.elementTimer = action.payload;
    },

    setBreathingDetails(state: any, action: PayloadAction<Pattern>) {
      state.breathingDetails = action.payload;
    },

    setExerciseTimer(state: any, action: PayloadAction<ExerciseTimer>) {
      state.timer = action.payload;
    },

    setIsAnimationRunning(state: any, action: PayloadAction<boolean>) {
      state.isAnimationRunning = action.payload;
    },

    setIsPaused(state: any, action: PayloadAction<boolean>) {
      state.isPaused = action.payload;
    },

    setExerciseDetails(state: any, action: PayloadAction<Exercise>) {
      state.exerciseDetails = action.payload;
    },

    setNoteDetails(state: any, action: PayloadAction<NotesDetails>) {
      state.noteDetails = action.payload;
    },

    setAssessmentDetails(state: any, action: PayloadAction<AssessmentDetails>) {
      state.assessmentDetails = action.payload;
    },

    setEditName(state: any, action: PayloadAction<EditName>) {
      state.editName = action.payload;
    },

    setUserInfo(state: any, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
    },

    setCategoryList(state: any, action: PayloadAction<any>) {
      state.categoryList = action.payload;
    },

    setGenderList(state: any, action: PayloadAction<any>) {
      state.genderList = action.payload;
    },

    setWallpapers(state: any, action: PayloadAction<Wallpapers>) {
      state.wallpapers = action.payload;
    }
  },
});

export const {
  setLanguage,
  setIsAuthenticated,
  setCourseId,
  setCourseName,
  setChapterId,
  setChapterTitle,
  setThemeId,
  setThemeName,
  setThemeDescription,
  setPuzzleId,
  setPuzzleName,
  setSelectedProfile,
  setMobileNumber,
  setOTPNumber,
  setResponseOTP,
  setIsPlaying,
  setChapterTimer,
  setShowSummary,
  setPlaylist,
  setShowMeditationPlayer,
  setCurrentTrackIndex,
  setIsRepeat,
  setIsShuffle,
  setPartId,
  setBreathingDetails,
  setExerciseTimer,
  setIsAnimationRunning,
  setIsPaused,
  setExerciseDetails,
  setNoteDetails,
  setAssessmentDetails,
  setEditName,
  setUserInfo,
  setCategoryList,
  setGenderList,
  setWallpapers
} = appSlice.actions;
export default appSlice.reducer;
