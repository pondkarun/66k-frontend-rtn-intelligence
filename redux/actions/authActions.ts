// Action Creator

export const setProfile = (data: any) => {
    return {
        type: "PROFILE_SET",
        payload: data,
    };
};