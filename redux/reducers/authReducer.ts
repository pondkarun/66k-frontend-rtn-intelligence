
const INIT_STATE = {
    profile: undefined,
    menus: [],
    topics: [],
    access_token: undefined,
    refresh_token: undefined,
};

type AuthAction = { type: string; payload: any };

const authReducer = (state = INIT_STATE, action: AuthAction) => {
    switch (action.type) {
        case "PROFILE_SET":
            return {
                ...state, profile: action.payload
            }
        case "ACCESS_TOKEN_SET":
            return {
                ...state, access_token: action.payload
            }
        case "REFRESH_TOKEN_SET":
            return {
                ...state, refresh_token: action.payload
            }
        case "MENUS_SET":
            return {
                ...state, menus: action.payload
            }
        case "TOPICS_SET":
            return {
                ...state, topics: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default authReducer;