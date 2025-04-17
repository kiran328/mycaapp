import axios from "axios";
import { axiosClient } from "../axiosClient/axiosClient";
import { MMKV } from "react-native-mmkv";
import { CHAT_API_KEY } from '@env';

const storage = new MMKV
const config = {
    headers: {
        "content-type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: storage.getString('token'),
    },
};

const chatConfig = {
    headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${CHAT_API_KEY}`,
    },
};

export async function getLoginDetails(mobileNumber: string, accountType: number): Promise<any> {
    const response: any = await axiosClient.post("app/login/", {
        mobile: mobileNumber,
        user_type_id: accountType
    });
    return response;
}


export async function verifyOTP(mobileNumber: String, accountType: String, otp: string): Promise<any> {
    const response: any = await axiosClient.post("app/verifyOTP/", {
        mobile: mobileNumber,
        otp: otp,
        user_type_id: accountType
    });
    return response;
}

export async function getCourses(): Promise<any> {
    const response: any = await axiosClient.get("app/get-courses/", config)
    return response;
}

export async function isCourseActive(id: any, active: boolean): Promise<any> {
    const response: any = await axiosClient.patch("app/update-course/",
        {
            id: id,
            is_active: active,
        }, config);
    return response;
}

export async function getAllChapters(): Promise<any> {
    const response: any = await axiosClient.get("app/get-chapters/", config);
    return response;
}

export async function getChapters(courseID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-chapters/", {
        course_id: courseID
    }, config);
    return response;
}

export async function getChapterParts(chapterID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-parts/", {
        chapter_id: chapterID
    }, config);
    return response;
}

export async function getChapterPercent(chapterID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-chapter-percent/", {
        chapter_id: chapterID
    }, config);
    return response;
}


export async function isChapterActive(id: any, active: boolean): Promise<any> {
    const response: any = await axiosClient.patch("app/update-chapter/",
        {
            id: id,
            is_active: active,
        }, config);
    return response;
}

export async function getPartComponent(partID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-components/", {
        part_id: partID
    }, config);
    return response;
}

export async function getOrganizations(): Promise<any> {
    const response: any = await axiosClient.get("app/get-orgs/");
    return response;
}

export async function getLanguages(): Promise<any> {
    const response: any = await axiosClient.get("app/get-languages/");
    return response;
}

export async function getNations(): Promise<any> {
    const response: any = await axiosClient.get("app/get-nations/");
    return response;
}

export async function getAllUsers(): Promise<any> {
    const response: any = await axiosClient.get("app/get-users/", config);
    return response;
}

export async function getDailyActivity(): Promise<any> {
    const response: any = await axiosClient.get("app/get-activity/", config);
    return response;
}

export async function getThemePuzzles(themeID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-puzzles/", {
        theme_id: themeID
    }, config);
    return response;
}

export async function getPuzzle(puzzleID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-puzzle/", {
        puzzle_id: puzzleID
    }, config);
    return response;
}

export async function getThemes(): Promise<any> {
    const response: any = await axiosClient.get("app/get-puzzle-themes/", config);
    return response;
}


export async function getAllWallpapers(userType: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-all-wallpaper/", {
        user_type_id: userType
    }, config);
    return response;
}

export async function getDashboardWallpaper(userType: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-dashboard-wallpaper/", {
        user_type_id: userType
    }, config);
    return response;
}

export async function getDailyActivityWallpaper(): Promise<any> {
    const response: any = await axiosClient.get("app/get-daily-activity-wallpaper/", config);
    return response;
}

export async function getMCQs(quizID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-mcq/", {
        chapter_comp_id: quizID
    }, config);
    return response;
}

export async function addChapterSummary(chapterId: number, timeSpent: number): Promise<any> {
    const response: any = await axiosClient.post("app/add-chapter-summary/", {
        chapter_id: chapterId,
        time_spend: timeSpent
    }, config);
    return response;
}

export async function getSummary(chapterId: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-chapter-summary/", {
        chapter_id: chapterId,
    }, config);
    return response;
}

export async function addMCQPoints(chapterId: number, elementId: number, mcqId: number, selectedOption: number, status: string): Promise<any> {
    const response: any = await axiosClient.post("app/add-mcq-attempt/", {
        chapter_id: chapterId,
        element_id: elementId,
        mcq_id: mcqId,
        marks: 1,
        selected_option: selectedOption,
        status: status
    }, config);
    return response;
}

export async function getMCQSummary(chapterId: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-mcq-attempt/", {
        chapter_id: chapterId,
    }, config);
    return response;
}

export async function getSolvedMCQs(componentID: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-solved-mcq/", {
        component_id: componentID,
    }, config);
    return response;
}

export async function getMeditationPlaylist(): Promise<any> {
    const response: any = await axiosClient.get("app/get-playlist/", config);
    return response;
}

export async function sendComponentTimeSpent(courseID: number, chapterID: number, partID: number, timeSpent: any): Promise<any> {
    const response: any = await axiosClient.post("app/send-comp-time/", {
        course_id: courseID,
        chapter_id: chapterID,
        part_id: partID,
        time_spent: timeSpent
    }, config);
    return response;
}

export async function getUserMoodData(month: string, year: string): Promise<any> {
    const response: any = await axiosClient.post("app/get-user-mood/", {
        month: month,
        year: year
    }, config);
    return response;
}

export async function submitUserMood(id: string, date: string, image: string): Promise<any> {
    const response: any = await axiosClient.post("app/add-user-mood/", {
        mood_id: id,
        mood_date: date,
        mood_img: image
    }, config);
    return response;
}

export async function getMoodList(): Promise<any> {
    const response: any = await axiosClient.get("app/get-mood-list/", config);
    return response;
}

export async function getHelplineDetails(): Promise<any> {
    const response: any = await axiosClient.get("app/send-contact-details/", config);
    return response;
}

export async function getAppVersion(): Promise<any> {
    const response: any = await axiosClient.get("app/get-app-version/", config);
    return response;
}

export async function getBreathingLevels(): Promise<any> {
    const response: any = await axiosClient.get("app/get-breathing-levels/", config);
    return response;
}

export async function getBreathingSteps(id: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-breathing-steps/", {
        level_id: id
    }, config);
    return response;
}

export async function getGuidedExercises(): Promise<any> {
    const response: any = await axiosClient.get("app/get-exercise-levels/", config);
    return response;
}

export async function getGuidedExerciseSteps(id: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-exercise-steps/", {
        exercise_id: id
    }, config);
    return response;
}

export async function getDiaryNotes(): Promise<any> {
    const response: any = await axiosClient.get("app/personal-diary/", config);
    return response;
}

export async function addPersonalNote(title: string, content: string): Promise<any> {
    const response: any = await axiosClient.post("app/personal-diary/", {
        title: title,
        content: content
    }, config);
    return response;
}

export async function updatePersonalNote(id: number, title: string, content: string): Promise<any> {
    const response: any = await axiosClient.patch(`app/personal-diary/${id}/`, {
        title: title,
        content: content
    }, config);
    return response;
}

export async function deletePersonalNote(id: number): Promise<any> {
    const response: any = await axiosClient.delete(`app/personal-diary/${id}/`, config);
    return response;
}

export async function getOnlineTts(param: any): Promise<any> {
    try {
        const response = await axiosClient.post(`app/generate-tts/`, {
            myvoice: param.myvoice,
            chapter_id: param.chapter_id,
            part_id: param.part_id,
            component_id: param.component_id
        });
        if (response.status === 200) {
            return response.data;
        } else {
            return "FAIL";
        }
    } catch (error: any) {
        console.error("Error message:", error.message);
        console.error("Error details:", error);
        return "FAIL";
    }
}

export async function getAssessmentList(): Promise<any> {
    const response: any = await axiosClient.get("app/get-assessments/", config);
    return response;
}

export async function getAssessmentDetails(id: number): Promise<any> {
    const response: any = await axiosClient.post("app/get-assessment-questions/", {
        assessment_id: id
    }, config);
    return response;
}

export async function submitAssessment(id: number, responses: any[]): Promise<any> {
    console.log({ id, responses })
    const response: any = await axiosClient.post("app/send-assessment-responses/", {
        assessment_id: id,
        responses: responses
    }, config);
    return response;
}

export async function registerMobileDevice(token: string): Promise<any> {
    const response: any = await axiosClient.post("app/register-mobile-device/", {
        token: token,
    }, config);
    return response;
}

export async function getNotifications(): Promise<any> {
    const response: any = await axiosClient.get("app/get-notification-list/", config);
    return response;
}

export async function getUserInfo(): Promise<any> {
    const response: any = await axiosClient.get("app/get-user-info/", config);
    return response;
}

export async function updateUserInfo(name: string, email: string, gender: string, category: number): Promise<any> {
    const response: any = await axiosClient.patch("app/update-user-info/", {
        full_name: name,
        email: email,
        gender_id: gender,
        subcategory: category
    }, config);
    return response;
}

export async function updateUserGenderInfo(gender: string): Promise<any> {
    const response: any = await axiosClient.patch("app/update-user-info/", {
        gender_id: gender
    }, config);
    return response;
}

export async function updateUserCategoryInfo(category: any): Promise<any> {
    const response: any = await axiosClient.patch("app/update-user-info/", {
        subcategory: category
    }, config);
    return response;
}

export async function getAboutUsInfo(): Promise<any> {
    const response: any = await axiosClient.get("app/get-aboutus-info/", config);
    return response;
}

export async function getFAQs(): Promise<any> {
    const response: any = await axiosClient.get("app/get-faq/", config);
    return response;
}

export async function getChatBot(): Promise<any> {
    const response: any = await axiosClient.get("app/get-chatbot-link/", config);
    return response;
}

export async function getFeedback(): Promise<any> {
    const response: any = await axiosClient.get("app/get-feedback-link/", config);
    return response;
}

export async function getSubCategory(): Promise<any> {
    const response: any = await axiosClient.get("app/get-category-list/", config);
    return response;
}

export async function getGenderList(): Promise<any> {
    const response: any = await axiosClient.get("app/get-gender-list/", config);
    return response;
}

export async function createChatStream(userMessage: string, prompt: string): Promise<any> {
    const response: any = await axios.post(`https://api.gooey.ai/v2/video-bots?example_id=frzg3f1e98v2`, {
        "functions": null,
        "variables": {
            "platform": "",
            "DISCLAIMER": "You give your consent to proceed with AI based chat",
            "MESSAGE_LENGTH": ""
        },
        "input_prompt": userMessage,
        "input_audio": null,
        "input_images": null,
        "input_documents": null,
        "bot_script": prompt,
        "doc_extract_url": null,
        "messages": [],
        "selected_model": "claude_3_5_sonnet",
        "document_model": null,
        "task_instructions": null,
        "keyword_instructions": "",
        "documents": [],
        "max_references": 10,
        "max_context_words": 800,
        "scroll_jump": 2,
        "embedding_model": "openai_3_large",
        "dense_weight": 1,
        "citation_style": "symbol_plaintext",
        "use_url_shortener": true,
        "asr_model": null,
        "asr_language": null,
        "asr_task": null,
        "asr_prompt": null,
        "translation_model": null,
        "user_language": null,
        "input_glossary_document": null,
        "output_glossary_document": null,
        "lipsync_model": "Wav2Lip",
        "tools": [],
        "avoid_repetition": false,
        "num_outputs": 1,
        "quality": 1,
        "max_tokens": 4000,
        "sampling_temperature": 0.7,
        "response_format_type": null,
        "tts_provider": null,
        "uberduck_voice_name": "kanye-west-rap",
        "uberduck_speaking_rate": 1,
        "google_voice_name": "hi-IN-Wavenet-A",
        "google_speaking_rate": 1,
        "google_pitch": 0,
        "bark_history_prompt": null,
        "elevenlabs_voice_name": null,
        "elevenlabs_api_key": null,
        "elevenlabs_voice_id": "21m00Tcm4TlvDq8ikWAM",
        "elevenlabs_model": "eleven_multilingual_v2",
        "elevenlabs_stability": 0.5,
        "elevenlabs_similarity_boost": 0.75,
        "elevenlabs_style": 0,
        "elevenlabs_speaker_boost": null,
        "azure_voice_name": null,
        "openai_voice_name": null,
        "openai_tts_model": null,
        "ghana_nlp_tts_language": null,
        "input_face": null,
        "face_padding_top": 2,
        "face_padding_bottom": 10,
        "face_padding_left": 0,
        "face_padding_right": 0,
        "sadtalker_settings": null
    }, chatConfig);
    return response;
}


export async function createChatStream2(userMessage: string, mobile: string): Promise<any> {
    const response: any = await axios.post(
        'https://sukoon-latest-production.up.railway.app/query',
        { input: userMessage, mobile: mobile }
    );
    return response;
}

export async function getConverstions(mobileNumber: string): Promise<any> {
    const response: any = await axios.get(`https://sukoon-latest-production.up.railway.app/fetch_convo?mobile=${mobileNumber}`);
    return response;
}


export async function skipGenderInfo(): Promise<any> {
    const response: any = await axiosClient.post("app/add-skip-record/", {
        gender_skip: 1,
    }, config);
    return response;
}

export async function skipCategoryInfo(): Promise<any> {
    const response: any = await axiosClient.post("app/add-skip-record/", {
        category_skip: 1,
    }, config);
    return response;
}

export async function submitChatBotFeedback(chat: string, type: string, feedbackMessage: string | null): Promise<any> {
    const response: any = await axiosClient.post("app/add-chatbot-feedback/", {
        feedback_category: chat,
        feedback_type: type,
        feedback_message: feedbackMessage,
    }, config);
    return response;
}

export async function getTermsConditions(): Promise<any> {
    const response: any = await axiosClient.get("app/send-agreement/", config);
    return response;
}

export async function saveAssessmentResult(id: number, marks: number | null, result: string | null): Promise<any> {
    const response: any = await axiosClient.post("app/save-assessment-result/", {
        assessment_id: id,
        marks: marks,
        result: result
    }, config);
    return response;
}

export async function getAssessmentData(id: number): Promise<any> {
    const response: any = await axiosClient.post("app/send-assessment-results/", {
        assessment_id: id,
    }, config);
    return response;
}