import axios from 'axios'
import {getToken, removeUserData} from '../store/userLocalStorage'

const token = getToken()
let instance = token ?
    axios.create({
        baseURL: process.env.VUE_APP_SERVER_BASE_URL,
        timeout: 2000,
        headers: {'Authorization': 'Bearer ' + token}
    }) :
    axios.create({
        baseURL: process.env.VUE_APP_SERVER_BASE_URL,
        timeout: 2000,
    })
instance.interceptors.response.use(interceptorOnSuccess, interceptorOnError)

function interceptorOnSuccess(response) {
    if (response.status === 401) {
        removeUserData()
        window.location.replace("/auth");
    }
    return response.data;
}

function interceptorOnError(error) {
    if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
}

export function login(data) {
    return instance.post('/api-v1/auth/login', data);
}

export function register(data) {
    return instance.post('/api-v1/auth/register', data);
}

export function getUser() {
    return instance.get('/api-v1/auth/user')
}

export function getFavorites() {
    return instance.get('/api-v1/card/favorites')
}

export function getLearnedCards(size, page) {
    return instance.get(`/api-v1/card/learned/${size}/${page}`)
}

export function getLearningCards(size, page) {
    return instance.get(`/api-v1/card/learning/${size}/${page}`)
}

export function getSuggestions(size, page) {
    return instance.get(`/api-v1/card/suggestions/${size}/${page}`)
}

export function createNewCard(data) {
    return instance.post('/api-v1/card/', data);
}

export function createCardsBatch(data) {
    return instance.post('/api-v1/card/batch-create', data);
}

export function addToFavorites(cardId) {
    return instance.put(`/api-v1/card/add-to-favorite/${cardId}`);
}

export function updateCard(data) {
    return instance.put('/api-v1/card/', data);
}

export function removeFromFavorites(cardId) {
    return instance.delete(`/api-v1/card/remove-from-favorite/${cardId}`);
}

export function removeCard(cardId) {
    return instance.delete(`/api-v1/card/${cardId}`);
}

export function getCard(cardId) {
    return instance.get(`/api-v1/card/${cardId}`);
}

export function createNewSession(data) {
    return instance.post('/api-v1/leitner/new-session', data);
}

export function updateSession(data) {
    return instance.post('/api-v1/leitner/update-session', data);
}

export function getCurrentSession() {
    return instance.get('/api-v1/leitner/get-session-cards')
}

export function updateInstance() {
    instance = axios.create({
        baseURL: process.env.VUE_APP_SERVER_BASE_URL,
        timeout: 2000,
        headers: {'Authorization': 'Bearer ' + getToken()}
    });
    instance.interceptors.response.use(interceptorOnSuccess, interceptorOnError)
}
