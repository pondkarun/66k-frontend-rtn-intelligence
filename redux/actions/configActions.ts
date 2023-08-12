export const setLoaging = (data: boolean) => {
    return {
        type: "LOADING_SET",
        payload: data,
    };
};
export const setBackground = (color: string) => {
    return {
        type: "BACKGROUND_SET",
        payload: color,
    };
};