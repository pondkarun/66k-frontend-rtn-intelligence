
const INIT_STATE = {
    loading: false,
    background: "#ffffff",
};

type CountryAction = { type: string; payload: any };

const configsReducer = (state = INIT_STATE, action: CountryAction) => {
    switch (action.type) {
        case "LOADING_SET":
            return {
                ...state, loading: action.payload
            }
        case "BACKGROUND_SET":
            return {
                ...state, background: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default configsReducer;