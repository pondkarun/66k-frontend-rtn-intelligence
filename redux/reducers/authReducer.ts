
const INIT_STATE = {
    profile: undefined,
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
        default:
            return {
                ...state
            }
    }
}

export default authReducer;