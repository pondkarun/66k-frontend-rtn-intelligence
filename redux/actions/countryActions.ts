export const setCountries = (data: any) => {
    return {
        type: "COUNTRIES_SET",
        payload: data,
    };
};

export const setCountriesAll = (data: any) => {
    return {
        type: "COUNTRIES_ALL_SET",
        payload: data,
    };
};