export type ActionTprops = 'add' | ''

export const setCollapsed = (bool: boolean) => {
    return {
        type: "IS_COLLAPSED",
        payload: bool,
    };
};

export const setActionFormInput = (payload: ActionTprops) => {
    return {
        type: "ACTION_TYPE",
        payload
    }
}