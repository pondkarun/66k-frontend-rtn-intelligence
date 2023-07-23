import { getAuthUser, setAuthToken, setRefreshToken } from "@/redux/actions/authActions";
import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";

type Props = {
    children: JSX.Element;
};

const useAuthToken = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const { authUser } = useSelector(({ auth }) => auth);
    useEffect(() => {
        const validateAuth = async () => {
            const cookies = new Cookies();
            const token = cookies.get("access_token");
            const refresh_token = cookies.get("refresh_token");

            if (refresh_token) dispatch(setRefreshToken(refresh_token));
            if (token) {
                // console.log("token: =====>", token)
                dispatch(setAuthToken(token));
                try {
                    getAuthUser(dispatch)
                    return;
                } catch (err) {
                    console.error("err in auth: ", err)
                    return;
                }
            } else {
                Router.push('/login');
            }
        };

        const checkAuth = () => {
            Promise.all([validateAuth()]).then(() => {
                setLoading(false);
            });
        };
        checkAuth();
    }, [dispatch]);

    return [loading, authUser];
}

const AuthRoutes = ({ children }: Props) => {
    useAuthToken();
    return <>{children}</>;
};

export default AuthRoutes;