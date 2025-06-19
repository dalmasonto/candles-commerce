import { em } from "@mantine/core"

export const DEFAULT_API_ROOT = 'http://localhost:8000/api'
export const DEFAULT_APP_URL = "http://localhost:3000"
export const BASE_MEDIA_URL = "http://localhost:8000"

// export const DEFAULT_API_ROOT = 'https://api.rhea.supercodehive.com/api'

// export const DEFAULT_API_ROOT = "https://liveapi.rhea.africa/api"
// export const DEFAULT_APP_URL = "https://rhea.supercodehive.com"
// export const BASE_MEDIA_URL = "https://media.rhea.supercodehive.com"

export const APP_NAME = "Monde des Parfum"
export const SEPARATOR = "|"

export const THEME_COOKIE_NAME = 'MondedesParfum-theme'
export const APP_KEY = 'MondedesParfum'
export const LOGO_URL = "/assets/images/mdp-logo.avif"
export const FAV_ICON_URL = "/assets/images/mdp-logo.avif"

// App Colors
// export const BLUE_DARK_COLOR = 'rgb(36, 42, 73)'
// export const BLUE_BG_COLOR = "#d3d6e9"

export const BLUE_DARK_COLOR = '#131419'
export const BLUE_BG_COLOR = "#fff"

export const PRIMARY_SHADE = [
    "#23A455", // 1 -> Light
    "#23A455", // 0 -> Lighter
    "#23A455", // 2 -> Main Primary Color
    "#23A455", // 3 -> Deep
    "#23A455", // 4 -> Deeper
    "#23A455", // 5 -> Light rgba 20
]


export const PRIMARY_DEEP_COLOR = '#1B2815'

export const containerSize = "lg"

export const API_ENDPOINTS = {
    // AUTH
    REGISTER: `/users/account/view`,
    LOGIN: `/users/auth/login`,
    LOGOUT: `/users/auth/logout`,
    REQUEST_PASSWORD_RESET: `/users/auth/password-reset`,
    PASSWORD_RESET_CONFIRM: `/users/auth/password-reset/confirm`,
    PASSWORD_RESET_VALIDATE_TOKEN: `/users/auth/password-reset/validate-token`,
    CHECK_LOGIN_STATUS: '/users/auth/check-login-status',
    CHANGE_PASSWORD: '/users/auth/change-password',

    // API KEYS management
    CREATE_API_KEY: '/users/auth/create-api-key',
    LIST_API_KEYS: '/users/auth/api-keys',
    DELETE_API_KEYS: '/users/auth/api-keys/delete',

    // USERS
    USERS: `/users/account/view`,
    PROFILES: `/users/account/profiles`,

    // Main
    COUNTRIES: `/countries`,
    CONTACT_FORM: `/contact`,
    REVIEWS: `/reviews`,
    SUBSCRIBERS: `/subscribers`,
    APP_STATS: `/app-stats`,
    USER_STATS: `/user-stats`,
    FAQs: `/faqs`,
    CATEGORIES: `/categories`,
    BLOGS: `/blogs`,
    RANDOMBLOGS: '/blogs/random-blogs',
    MEDIA: `/media`,

    ECOMMERCE_STATS: '/commerce/stats',
    ECOMMERCE_PRODUCTS: '/commerce/products',
    ECOMMERCE_CATEGORIES: '/commerce/categories',
    ECOMMERCE_ORDERS: '/commerce/orders',
    ECOMMERCE_CARTS: '/commerce/carts',
    ECOMMERCE_DISCOUNTS: '/commerce/discounts',
    ECOMMERCE_PRODUCT_IMAGES: '/commerce/product-images',
    ECOMMERCE_TRANSACTIONS: '/commerce/transactions',
}

export const EMOJIS = {
    "100": "💯",
    "1234": "🔢",
    "grinning": "😀",
    "grimacing": "😬",
    "grin": "😁",
    "joy": "😂",
    "rofl": "🤣",
    "partying": "🥳",
    "partypopper": "🎉",
    "smiley": "😃",
    "smile": "😄",
    "sweat_smile": "😅",
    "laughing": "😆",
    "innocent": "😇",
    "wink": "😉",
    "blush": "😊",
    "slightly_smiling_face": "🙂",
    "upside_down_face": "🙃",
    "relaxed": "☺️",
    "yum": "😋",
    "relieved": "😌",
    "heart_eyes": "😍",
    "kissing_heart": "😘",
    "kissing": "😗",
    "kissing_smiling_eyes": "😙",
    "kissing_closed_eyes": "😚",
    "stuck_out_tongue_winking_eye": "😜",
    "zany_face": "🤪",
    "raised_eyebrow": "🤨",
    "monocle_face": "🧐",
    "stuck_out_tongue_closed_eyes": "😝",
}

export const DEFAULT_MEDIA_PAGE_SIZE = 25

export const LINK_WEIGHT = 500

export const LOCAL_STORAGE_KEYS = {
    user: `${APP_KEY}_user`,
    user_id: `${APP_KEY}_user_id`,
    token: `${APP_KEY}_token`,
    login_status: `${APP_KEY}_login_status`,
}

export const TABLE_ICON_SIZE = "22px"

export const DASHBOARD_ICON_SIZE = 36
export const DASHBOARD_ICON_STROKE = em(1)
export const DASHBOARD_STAT_COL_SIZES = { xs: 12, sm: 6, md: 4, lg: 3 }