// Action Creator

import Api from "@/services/Api";
import axios from 'axios';
import { countriesAllService, countriesService } from "@/services/countries";
import { Cookies } from "react-cookie";
import { setCountries, setCountriesAll } from "./countryActions";
import { menusService } from "@/services/menus";
import { internationalRelationsTopicsService } from "@/services/internationalRelationsTopics";

const cookies = new Cookies();

export const setProfile = (data: any) => {
    return {
        type: "PROFILE_SET",
        payload: data,
    };
};

export const setMenus = (data: any) => {
    return {
        type: "MENUS_SET",
        payload: data,
    };
};

export const setTopics = (data: any) => {
    return {
        type: "TOPICS_SET",
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
            countriesService().then(res => {
                if (res.data.data) dispatch(setCountries(res.data.data));
            })
            countriesAllService().then(res => {
                if (res.data.data) dispatch(setCountriesAll(res.data.data));
            })
            menusService().then(res => {
                if (res.data.data) dispatch(setMenus(res.data.data));
            })
            internationalRelationsTopicsService().then(res => {
                if (res.data.data) dispatch(setTopics(res.data.data));
            })
            if (dispatch) dispatch(setProfile(data));
        } else {
            logout(dispatch)
        }
    }).catch((error) => {
        console.log('error2 :>> ', error);
        logout(dispatch)
    });
};

export const setRefreshToken = (refresh_token: string) => {
    return {
        type: "REFRESH_TOKEN_SET",
        payload: refresh_token,
    }
};

const Axios = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVICE}`,
    headers: {
        'Content-Type': 'application/json',
        'x-key-rtn-ttt': `${process.env.NEXT_PUBLIC_KEY}`,
    },
    transformRequest: [function (data, headers) {
        const refresh_token = cookies.get('refresh_token');
        if (refresh_token) {
            headers.Authorization = "Bearer " + refresh_token;
        }
        return JSON.stringify(data);
    }],
});

export const refreshToken = async (dispatch?: any) => {
    try {
        const { data }: any = await Axios.get(`/auth/refresh-token`)
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
    removeCookieUserAuth(dispatch)
};

const removeCookieUserAuth = (dispatch?: any) => {
    cookies.remove("access_token", { path: '/' });
    cookies.remove("refresh_token", { path: '/' });
    location.reload()
}