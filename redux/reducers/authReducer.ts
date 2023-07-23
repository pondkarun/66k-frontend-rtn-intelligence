
const INIT_STATE = {
    profile: undefined
};

type AuthAction = { type: string; payload: any };

const authReducer = (state = INIT_STATE, action: AuthAction) => {
    switch (action.type) {
        case "PROFILE_SET":
            return {
                ...state, profile: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default authReducer;