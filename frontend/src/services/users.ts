import { RegistrationType } from "@/types/yup";
import {
    EditProfileType,
    ProfileSchema,
    ProfilesSchema,
} from "@/types/profile";
import { createCaptchaHeader, createAuthHeader } from "./common";
import apiClient from "@/config/apiClient";

const api = "users";
const resendApi = "resend";
const logoutApi = "logout";

const getUsers = async (begin: number, end: number) => {
    const request = await apiClient.get(`/${api}?begin=${begin}&end=${end}`);
    const profiles = await ProfilesSchema.validate(request.data);
    return profiles;
};

const getUser = async (id: string) => {
    const request = await apiClient.get(`/${api}/${id}`);
    const profile = await ProfileSchema.validate(request.data);
    return profile;
};

const register = async (newUser: RegistrationType, captchaToken: string) => {
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

const editProfile = async (
    id: string,
    newProfile: EditProfileType,
    token: string
) => {
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
    if (newProfile.publicProfile) form.append("publicProfile", String(newProfile.publicProfile));

    const request = await apiClient.put(
        `/${api}/${id}`,
        form,
        createAuthHeader(token)
    );
    return request;
};

const resendVerify = async (email: string, captchaToken: string) => {
    await apiClient.post(
        `/${resendApi}`,
        {
            action: "CONFIRMATION",
            email,
        },
        createCaptchaHeader(captchaToken)
    );
};

const resetPassword = async (email: string, captchaToken: string) => {
    await apiClient.post(
        `/${resendApi}`,
        {
            action: "RESET PASSWORD",
            email,
        },
        createCaptchaHeader(captchaToken)
    );
};

const deleteAccount = async (id: string, token: string) => {
    return await apiClient.delete(`/${api}/${id}`, createAuthHeader(token));
};

const logout = async (token: string) => {
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
    getUsers
};
