import axios, { AxiosRequestConfig } from "axios";
import { BLUE_DARK_COLOR, DEFAULT_API_ROOT, DEFAULT_APP_URL } from "./constants"
import { MantineColorScheme, MantineTheme } from "@mantine/core";

export const isDarkMode = (colorScheme: MantineColorScheme) => {
    return colorScheme === "dark"
}

export const getPrimaryColor = (theme: MantineTheme) => {
    return theme?.colors?.orange[6]
}

export const formatCurrency = (price: any) => {
    if (price) {
        return Number(price).toLocaleString('en-US', {
            minimumFractionDigits: 2,
        })
    }
    return ''
}

export const checkIfEndwithSlash = (st: string) => {
    const len = st.length;
    const end = st.substring(len - 1, len)
    const regex = new RegExp(/\//)
    return regex.test(end)
}

export const removeLastSlash = (st: string) => {
    const len = st.length;
    return st.substring(0, len - 1);
}

export const matchTest = (str1: string, str2: string) => {
    let string1 = str1;
    let string2 = str2;

    const str1endswithslash = checkIfEndwithSlash(string1)
    const str2endswithslash = checkIfEndwithSlash(string2)

    if (str1endswithslash) {
        string1 = removeLastSlash(string1)
    }
    if (str2endswithslash) {
        string2 = removeLastSlash(string2)
    }

    const testpath = `^${string1}$`

    const regex = new RegExp(testpath, "gi");

    return regex.test(string2);
}


export const makeRequest = async (url: string, method: string, extra_headers: Object, data: Object, params: Object = {}) => {

    const options: any = {
        method: method,
        url: url,
        headers: {
            // 'Content-Type': 'application/json',
            ...extra_headers
        },
        data: data,
        params: params
    };

    return await axios.request(options).then(response => {
        return {
            "success": response.data
        }
    }).catch(function (error) {
        return {
            "error": error
        }
    });
}

export interface RequestProps {
    url: string
    method: string
    extra_headers?: any
    data?: Object
    params?: Object
    useNext?: boolean
}

export const makeRequestOne = async ({ url, method, extra_headers, data, params, useNext }: RequestProps) => {
    let BASE_URL = DEFAULT_API_ROOT
    if (useNext) {
        BASE_URL = `${DEFAULT_APP_URL}/api`
    }
    const options: AxiosRequestConfig = {
        method: method,
        url: `${BASE_URL}${url}/`,
        headers: {
            ...extra_headers
        },
        data: data,
        params: params
    };
    return axios.request(options)
}


export const modalOptions = (theme: MantineTheme, colorScheme: MantineColorScheme) => {
    return {
        radius: theme?.radius?.lg,
        sx: {
            ".mantine-Modal-modal": {
                background: isDarkMode(colorScheme) ? BLUE_DARK_COLOR : theme.colors.gray[0],
            }
        },
        overlayOpacity: 0.7,
        overlayBlur: 0.7,
    }
}


export const createImageURl = (file: File) => {
    return URL.createObjectURL(file);
}


export const toDate = (datestring: string, full = false) => {
    if (!datestring) {
        return '-'
    }
    if (full) {
        return `${new Date(datestring).toDateString()} (${new Date(datestring).toLocaleTimeString()})`
    }
    return new Date(datestring).toDateString() ?? '-'
}

export const limitChars = (word: any, limit: number, has_dots?: boolean) => {
    if (word?.length <= limit) {
        return word;
    }
    return `${word?.substring(0, limit)}${has_dots ? "..." : ""}`;
}


export const alertModalOptions = {
    radius: "lg",
    size: "md",
    centered: true,
    padding: 0,
    styles: {
        header: {
            display: "None"
        }
    },
}

export function formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}


export function convertJSONToFormData(jsonData: any) {
    const formData = new FormData();

    function appendFormData(data: any, keyPrefix = '') {
        if (typeof data === 'object' && data !== null) {
            for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                    const value = data[key];
                    const fullKey = keyPrefix ? `${keyPrefix}[${key}]` : key;
                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        if (fullKey === 'requested_by[signature]') {
                            formData.append(fullKey, value)
                        }
                        appendFormData(value, fullKey);
                    } else if (value instanceof File) {
                        formData.append(fullKey, value);
                    } else {
                        formData.append(fullKey, value);
                    }
                }
            }
        }
    }

    appendFormData(jsonData);
    return formData;
}



export interface INotification {
    sender: any
    receiver: any
    form: 'Cash Advance Form'
    message: string
    url?: string
}

// export function makeNotification(notification: INotification, token: any) {
//     makeRequestOne({
//         url: URLS.NOTIFICATIONS,
//         method: 'POST',
//         data: notification,
//         extra_headers: {
//             authorization: `Bearer ${token}`,
//         },
//         useNext: true
//     }).then(() => { }).catch(() => { })
// }