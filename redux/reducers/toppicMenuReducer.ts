
const INIT_STATE = {
    country: undefined,
    toppic: undefined,
};

type AuthAction = { type: string; payload: any };

const toppicMenuReducer = (state = INIT_STATE, action: AuthAction) => {
    switch (action.type) {
        case "SELECT_COUNTRY_SET":
            return {
                ...state, country: action.payload
            }
        case "SELECT_TOPPIC_SET":
            return {
                ...state, toppic: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default toppicMenuReducer;