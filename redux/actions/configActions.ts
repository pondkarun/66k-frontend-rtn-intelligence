export const setLoaging = (data: boolean) => {
    return {
        type: "LOADING_SET",
        payload: data,
    };
};