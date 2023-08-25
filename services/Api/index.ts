import { logout, refreshToken } from '../../redux/actions/authActions';
import Api from './Api'
import type { AxiosRequestConfig } from 'axios';


const apiPost = (url: string, data?: any, configs?: AxiosRequestConfig): Promise<any> => {
    return new Promise((resolve, reject) => {
        Api.post(url, data, { ...configs }).then((res) => {
            resolve(res);
        }).catch((eror) => {
            refreshToken().then((res) => {
                Api.post(url, data).then((res) => {
                    resolve(res);
                }).catch((eror) => {
                    reject(eror)
                })
            }).catch((eror) => {
                logout()
                reject(eror)
            })
        })
    });
}

const apiGet = (url: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        Api.get(url, data).then((res) => {
            resolve(res);
        }).catch((eror) => {
            refreshToken().then((res) => {
                Api.get(url, data).then((res) => {
                    resolve(res);
                }).catch((eror) => {
                    reject(eror)
                })
            }).catch((eror) => {
                logout()
                reject(eror)
            })
        })
    });
}

const apiPut = (url: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        Api.put(url, data).then((res) => {
            resolve(res);
        }).catch((eror) => {
            refreshToken().then((res) => {
                Api.put(url, data).then((res) => {
                    resolve(res);
                }).catch((eror) => {
                    reject(eror)
                })
            }).catch((eror) => {
                logout()
                reject(eror)
            })
        })
    });
}

const apiPatch = (url: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        Api.patch(url, data).then((res) => {
            resolve(res);
        }).catch((eror) => {
            refreshToken().then((res) => {
                Api.patch(url, data).then((res) => {
                    resolve(res);
                }).catch((eror) => {
                    reject(eror)
                })
            }).catch((eror) => {
                logout()
                reject(eror)
            })
        })
    });
}

const apiDelete = (url: string, data?: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        Api.delete(url, data).then((res) => {
            resolve(res);
        }).catch((eror) => {
            refreshToken().then((res) => {
                Api.delete(url, data).then((res) => {
                    resolve(res);
                }).catch((eror) => {
                    reject(eror)
                })
            }).catch((eror) => {
                logout()
                reject(eror)
            })
        })
    });
}

export default {
    post: apiPost,
    get: apiGet,
    put: apiPut,
    delete: apiDelete,
    patch: apiPatch,
}