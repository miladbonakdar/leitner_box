const userKey = "application_user"
const userTokenKey = "application_user_token"

export function getUser() {
    const data = localStorage.getItem(userKey)
    if (!data) return null
    return JSON.parse(data)
}

export function storeUserToken(user, token) {
    const userData = {
        identity: {
            ...user,
            token
        }
    }
    localStorage.setItem(userKey, JSON.stringify(userData))
    localStorage.setItem(userTokenKey, token)
}

export function storeUserDetails(details) {
    const data = localStorage.getItem(userKey)
    if (!data) throw new Error("user is not stored yet")
    const user = JSON.parse(data)
    user.leitner = details
    localStorage.setItem(userKey, JSON.stringify(user))
}

export function removeUserData() {
    localStorage.removeItem(userKey);
    localStorage.removeItem(userTokenKey);
}

export function getToken() {
    return localStorage.getItem(userTokenKey)
}
