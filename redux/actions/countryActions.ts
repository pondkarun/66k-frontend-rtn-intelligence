export const setCountries = (data: any) => {
    return {
        type: "COUNTRIES_SET",
        payload: data,
    };
};