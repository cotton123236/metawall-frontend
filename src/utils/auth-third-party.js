export const checkThirdPartyLogin = {
    google: async () => {
        // 獲取當下最新的 google-token 狀態
        const googleToken = $cookies.get('google-token')
        if (googleToken) {
            localStorage.setItem("token", googleToken)
        }
        return googleToken
    }
}

export const execThirdPartyLogout = () => {
    $cookies.remove('google-token')
    localStorage.removeItem("token")
}