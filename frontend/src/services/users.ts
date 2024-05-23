import { RegistrationType } from "@/types/yup";
import {
    EditProfile,
    Profile,
    ProfileSchema,
    ProfilesSchema,
} from "@/types/profile";
import { createCaptchaHeader, createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";
import { AxiosResponse } from "axios";

const api = "users";
const resendApi = "resend";
const logoutApi = "logout";

/**
 * Retrieves users.
 * @param {number} begin Beginning index for user range.
 * @param {number} end Inclusive end index for user range.
 * @returns {Profile[]} The chat members data.
 */
const getUsers = async (begin: number, end: number): Promise<Profile[]> => {
    const request = await apiClient.get(`/${api}?begin=${begin}&end=${end}`);
    const profiles = await ProfilesSchema.validate(request.data);
    return profiles;
};

/**
 * Retrieves a user's profile.
 * @param {string} id The user's id.
 * @param {string} token User access token.
 * @returns {Profile} The chat members data.
 */
const getUser = async (id: string, token: string): Promise<Profile> => {
    const request = await apiClient.get(
        `/${api}/${id}`,
        createAuthHeader(token)
    );
    const profile = await ProfileSchema.validate(request.data);
    return profile;
};

/**
 * Registers a user.
 * @param {RegistrationType} newUser New user's info.
 * @param {string} captchaToken New user's captcha token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const register = async (
    newUser: RegistrationType,
    captchaToken: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const form = new FormData();
    form.append("first_name", newUser.firstName);
    form.append("last_name", newUser.lastName);
    form.append("email", newUser.email);
    form.append("password", newUser.password);

    if (newUser.x) form.append("x", newUser.x);
    if (newUser.y) form.append("y", newUser.y);
    if (newUser.width) form.append("width", newUser.width);
    if (newUser.height) form.append("height", newUser.height);
    if (newUser.files) form.append("photo", newUser.files);

    const request = await apiClient.post(
        `/${api}`,
        form,
        createCaptchaHeader(captchaToken)
    );
    return request;
};

/**
 * Edits a user's profile.
 * @param {string} id User's id.
 * @param {EditProfile} newProfile User's edited profile
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const editProfile = async (
    id: string,
    newProfile: EditProfile,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const form = new FormData();

    if (newProfile.firstName) form.append("first_name", newProfile.firstName);
    if (newProfile.lastName) form.append("last_name", newProfile.lastName);

    if (newProfile.x) form.append("x", newProfile.x);
    if (newProfile.y) form.append("y", newProfile.y);
    if (newProfile.width) form.append("width", newProfile.width);
    if (newProfile.height) form.append("height", newProfile.height);
    if (newProfile.files) form.append("photo", newProfile.files);

    if (newProfile.email) form.append("email", newProfile.email);
    if (newProfile.password) form.append("password", newProfile.password);
    if (newProfile.publicProfile === false || newProfile.publicProfile === true)
        form.append("public_profile", String(newProfile.publicProfile));

    const request = await apiClient.put(
        `/${api}/${id}`,
        form,
        createAuthHeader(token)
    );
    return request;
};

/**
 * Resends verification email.
 * @param {string} email Visitor's email.
 * @param {string} captchaToken Visitor's captcha token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const resendVerify = async (
    email: string,
    captchaToken: string
): Promise<AxiosResponse<unknown, unknown>> => {
    return await apiClient.post(
        `/${resendApi}`,
        {
            action: "CONFIRMATION",
            email,
        },
        createCaptchaHeader(captchaToken)
    );
};

/**
 * Resets user's password.
 * @param {string} email User's email.
 * @param {string} captchaToken User's captcha token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const resetPassword = async (
    email: string,
    captchaToken: string
): Promise<AxiosResponse<unknown, unknown>> => {
    return await apiClient.post(
        `/${resendApi}`,
        {
            action: "RESET PASSWORD",
            email,
        },
        createCaptchaHeader(captchaToken)
    );
};

/**
 * Deletes an account.
 * @param {string} id User's id.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const deleteAccount = async (
    id: string,
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    return await apiClient.delete(`/${api}/${id}`, createAuthHeader(token));
};

/**
 * Logout of the web app.
 * @param {string} token User access token.
 * @returns {Promise<AxiosResponse<unknown, unknown>>} Axios response promise.
 */
const logout = async (
    token: string
): Promise<AxiosResponse<unknown, unknown>> => {
    const response = await apiClient.post(
        `/${logoutApi}`,
        {},
        createAuthHeader(token)
    );
    return response;
};

export {
    register,
    resendVerify,
    resetPassword,
    deleteAccount,
    logout,
    editProfile,
    getUser,
    getUsers,
};
