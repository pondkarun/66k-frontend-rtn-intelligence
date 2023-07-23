// Action Creator

import Api from "@/services/Api";
import { Cookies } from "react-cookie";

export const setProfile = (data: any) => {
    return {
        type: "PROFILE_SET",
        payload: data,
    };
};

export const setAuthToken = (access_token: string) => {
    return {
        type: "ACCESS_TOKEN_SET",
        payload: access_token,
    }
};

export const getAuthUser = (dispatch?: any) => {
    Api.get(`/auth/profile`).then(({ data }: any) => {
        if (data) {
            dispatch(setProfile(data.data));
        } else {
            logout(dispatch)
        }
    }).catch((error) => {
        logout(dispatch)
    });
};

export const setRefreshToken = (refresh_token: string) => {
    return {
        type: "REFRESH_TOKEN_SET",
        payload: refresh_token,
    }
};

export const refreshToken = async (dispatch?: any) => {
    try {
        const cookies = new Cookies();
        const refresh_token = cookies.get("refresh_token");
        const { data }: any = await Api.post(`/token/access_token`, { refresh_token })
        // console.log('data.data :>> ', data.data);
        cookies.remove("access_token", { path: '/' });
        if (data.data.access_token) {
            cookies.set("access_token", data.data.access_token, { path: "/" });
            if (dispatch) {
                dispatch(setAuthToken(data.data.access_token));
                getAuthUser(dispatch)
            }
            return data.data.access_token
        } else {
            logout(dispatch)
            return null
        }
    } catch (error) {
        logout(dispatch)
        return error
    }

};

export const logout = (dispatch?: any) => {
    const cookies = new Cookies();
    const token = cookies.get("access_token");
    if (token && (token != undefined && token != "undefined")) {
        Api.get('/logout').then(async (data) => {
            removeCookieUserAuth(dispatch)
        }).catch((eror) => {
            console.log(`eror`, eror)
            removeCookieUserAuth(dispatch)
        })
    } else {
        removeCookieUserAuth(dispatch)
    }
};

const removeCookieUserAuth = (dispatch?: any) => {
    const cookies = new Cookies();
    cookies.remove("access_token", { path: '/' });
    cookies.remove("refresh_token", { path: '/' });
    location.reload()
}