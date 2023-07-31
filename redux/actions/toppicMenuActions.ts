export const setSelectCountry = (id: string) => {
    return {
        type: "SELECT_COUNTRY_SET",
        payload: id,
    };
};

export const setSelectToppic = (id: string) => {
    return {
        type: "SELECT_TOPPIC_SET",
        payload: id,
    };
};