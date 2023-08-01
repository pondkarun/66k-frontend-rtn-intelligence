
const INIT_STATE = {
    loading: false,
};

type CountryAction = { type: string; payload: any };

const configsReducer = (state = INIT_STATE, action: CountryAction) => {
    switch (action.type) {
        case "LOADING_SET":
            return {
                ...state, loading: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default configsReducer;