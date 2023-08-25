
const INIT_STATE = {
    country: undefined,
    toppic: undefined,
    country_obj: undefined,
    toppic_obj: undefined,
    search: ''
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
        case "OBJ_COUNTRY_SET":
            return {
                ...state, country_obj: action.payload
            }
        case "OBJ_TOPPIC_SET":
            return {
                ...state, toppic_obj: action.payload
            }
        case "SEARCH":
            return {
                ...state, search: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default toppicMenuReducer;
export type MenuT = typeof INIT_STATE