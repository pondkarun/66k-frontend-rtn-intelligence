
const INIT_STATE = {
    country_group: [],
    country: []
};

type CountryAction = { type: string; payload: any };

const countryReducer = (state = INIT_STATE, action: CountryAction) => {
    switch (action.type) {
        case "COUNTRIES_SET":
            return {
                ...state, country_group: action.payload
            }
        case "COUNTRIES_ALL_SET":
            return {
                ...state, country: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default countryReducer;