export const checkThirdPartyLogin = {
    google: async () => {
        // 獲取當下最新的 google-token 狀態
        const urlParams = new URLSearchParams(window.location.search)
        const googleToken = $cookies.get('google-token') || urlParams.get('token')
        if (googleToken) {
            localStorage.setItem("token", googleToken)
        }
        return googleToken
    },
    discord: async () => {
        // 獲取當下最新的 discord-token 狀態
        const urlParams = new URLSearchParams(window.location.search)
        const discordToken = $cookies.get('discord-token') || urlParams.get('token')
        if (discordToken) {
            localStorage.setItem("token", discordToken)
        }
        return discordToken
    },
    line: async () => {
        // 獲取當下最新的 line-token 狀態
        const urlParams = new URLSearchParams(window.location.search)
        const lineToken = $cookies.get('line-token') || urlParams.get('token')
        if (lineToken) {
            localStorage.setItem("token", lineToken)
        }
        return lineToken
    },
    facebook: async () => {
        // 獲取當下最新的 facebook-token 狀態
        const urlParams = new URLSearchParams(window.location.search)
        const facebookToken = $cookies.get('facebook-token') || urlParams.get('token')
        if (facebookToken) {
            localStorage.setItem("token", facebookToken)
        }
        return facebookToken
    }
}

export const execThirdPartyLogout = () => {
    $cookies.remove('discord-token')
    $cookies.remove('google-token')
    $cookies.remove('line-token')
    $cookies.remove('facebook-token')
    localStorage.removeItem("token")
}