import axios from "axios";
import {getToken, removeUserData} from "../store/userLocalStorage";

const token = getToken();
let instance = token
    ? axios.create({
        baseURL: process.env.VUE_APP_SERVER_BASE_URL,
        timeout: 2000,
        headers: {Authorization: "Bearer " + token}
    })
    : axios.create({
        baseURL: process.env.VUE_APP_SERVER_BASE_URL,
        timeout: 2000
    });
instance.interceptors.response.use(interceptorOnSuccess, interceptorOnError);

function interceptorOnSuccess(response) {
    if (response.status === 401) {
        removeUserData();
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
    return instance.post("/api-v1/auth/login", data);
}

export function register(data) {
    return instance.post("/api-v1/auth/register", data);
}

export function getUser() {
    return instance.get("/api-v1/auth/user");
}

export function approveAsAdmin(secret) {
    return instance.put(`/api-v1/auth/approve-as-admin/${secret}`);
}

export function getLearnedCards(size, page) {
    return instance.get(`/api-v1/card/learned/${size}/${page}`);
}

export function getLearningCards(size, page) {
    return instance.get(`/api-v1/card/learning/${size}/${page}`);
}

export function getSuggestions(size, page, search = null) {
    let url = `/api-v1/card/suggestions/${size}/${page}`;
    if (search) url += "?search=" + search;
    return instance.get(url);
}

export function createNewCard(data) {
    return instance.post("/api-v1/card/", data);
}

export function createCardsBatch(data) {
    return instance.post("/api-v1/card/batch-create", data);
}

export function knowTheCard(cardId) {
    return instance.put(`/api-v1/card/know-the-card/${cardId}`);
}

export function updateCard(data) {
    return instance.put("/api-v1/card/", data);
}

export function removeCard(cardId) {
    return instance.delete(`/api-v1/card/${cardId}`);
}

export function getCard(cardId) {
    return instance.get(`/api-v1/card/${cardId}`);
}

export function getCardsList(size, page, search = null) {
    let url = `/api-v1/card/list/${size}/${page}`;
    if (search) url += "?search=" + search;
    return instance.get(url);
}

export function createNewSession() {
    return instance.post("/api-v1/leitner/new-session");
}

export function updateSession(data) {
    return instance.post("/api-v1/leitner/update-session", data);
}

export function getCurrentSession() {
    return instance.get("/api-v1/leitner/get-session-cards");
}

export function getRandomSuggestions(size = 10) {
    return instance.get(`/api-v1/card/random-suggestions/${size}`);
}

export function getLanguages() {
    return instance.get(`/api-v1/public/languages`);
}

export function createCategory(data) {
    return instance.post(`/api-v1/category/`, data);
}

export function updateCategory(data) {
    return instance.put(`/api-v1/category/`, data);
}

export function getCategory(catId) {
    return instance.get(`/api-v1/category/${catId}`);
}

export function deleteCategory(catId) {
    return instance.delete(`/api-v1/category/${catId}`);
}

export function listCategories(size, page) {
    return instance.get(`/api-v1/category/list/${size}/${page}`);
}

export function getMyCategories() {
    return instance.get(`/api-v1/category/my-categories/`);
}

export function categorySuggestions(size, page, language, search = null) {
    let url = `/api-v1/category/suggestions/${size}/${page}/${language}`
    if (search) url += "?search=" + search
    return instance.get(url)
}

export function addCategoryToFavorite(catId) {
    return instance.put(`/api-v1/category/add-to-favorite/${catId}`);
}

export function removeCategoryFromFavorite(catId) {
    return instance.delete(`/api-v1/category/remove-from-favorite/${catId}`);
}

export function getFavoriteCards(size, page) {
    return instance.get(`/api-v1/category/favorites/${size}/${page}`);
}

export function rateCategory(catId) {
    return instance.patch(`/api-v1/category/rate/${catId}`);
}

export function makeCategoryPublic(catId) {
    return instance.patch(`/api-v1/category/make-public/${catId}`);
}

export function makeCategoryPrivate(catId) {
    return instance.patch(`/api-v1/category/make-private/${catId}`);
}

export function updateInstance() {
    instance = axios.create({
        baseURL: process.env.VUE_APP_SERVER_BASE_URL,
        timeout: 2000,
        headers: {Authorization: "Bearer " + getToken()}
    });
    instance.interceptors.response.use(interceptorOnSuccess, interceptorOnError);
}
