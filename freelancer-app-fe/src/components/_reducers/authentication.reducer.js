const defaultState = {
    firstName: "",
    lastName: "",
    email: "",
    userId: 0,
    phoneNumber: "",
    aboutMe: "",
    skills: "",
    loginFailed: false,
    loginMsg: "",
    registerFailed: false,
    registerMsg: "",
    isloggedIn: false,
    projectList: [],
    bidList: [],
    skillList: "",
    projectId: "",
    userId: "",
    avatar: ""
}

export default function actionReducer(state = defaultState, action) {
    const newState = { ...state };
    switch (action.type) {
        case 'loginSuccess':
            newState.firstName = action.payload.firstName;
            newState.lastName = action.payload.lastName;
            newState.email = action.payload.email;
            newState.userId = action.payload.userId;
            newState.phoneNumber = action.payload.phoneNumber;
            newState.loginFailed = !action.payload.success;
            newState.loginMsg = action.payload.message;
            newState.isloggedIn = true;
            newState.userId = action.payload.userId
            return newState;
        case 'loginFailed':
            newState.loginFailed = true;
            newState.loginMsg = action.payload.message;
            return newState;
        case 'registerSuccess':
            newState.firstName = "";
            newState.lastName = "";
            newState.email = "";
            newState.userId = 0;
            newState.phoneNumber = "";
            newState.aboutMe = "";
            newState.avatar = "";
            newState.registerFailed = !action.payload.success;
            newState.registerMsg = action.payload.message;
            return newState;
        case 'registerFailed':
            newState.registerFailed = true;
            newState.registerMsg = action.payload.message;
            return newState;
        case 'fileUploadSuccess':
            return newState;
        case 'fileDownloadSuccess':
            return newState;
        case 'createNewFolderSuccess':
            return newState;
        case 'userProfileUpdateSuccess':
            return newState;
        case 'retrieveUserProfileSuccess':
            newState.firstName = action.payload.firstName;
            newState.lastName = action.payload.lastName;
            newState.email = action.payload.email;
            newState.phoneNumber = action.payload.phoneNumber;
            newState.aboutMe = action.payload.aboutMe;
            newState.avatar = action.payload.avatar;
            return newState;
        default:
            return newState;
    }
}