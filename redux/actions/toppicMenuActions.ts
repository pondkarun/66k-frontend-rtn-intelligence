export const setSelectCountry = (id: string) => {
    return {
        type: "SELECT_COUNTRY_SET",
        payload: id,
    };
};

export const setDefaultSearch = (search: string) => {
    return {
        type: "SEARCH",
        payload: search,
    };
};

export const setSelectToppic = (id: string) => {
    return {
        type: "SELECT_TOPPIC_SET",
        payload: id,
    };
};

export const setObjCountry = (id: any) => {
    return {
        type: "OBJ_COUNTRY_SET",
        payload: id,
    };
};

export const setObjToppic = (id: any) => {
    return {
        type: "OBJ_TOPPIC_SET",
        payload: id,
    };
};