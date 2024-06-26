/**
 * Contains routes information for the whole website.
*/

import Login from "@/components/pages/authentication/Login";
import Register from "@/components/pages/authentication/Register";
import Forget from "@/components/pages/authentication/Forget";
import ContactUs from "@/components/pages/ContactUs";
import Account from "@/components/pages/account/Account";
import Profile from "@/components/pages/account/Profile";
import About from "@/components/pages/About";
import Friend from "@/components/pages/Friend";
import Discover from "@/components/pages/Discover";
import Chats from "@/components/pages/chat/Chats";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";

interface WebsiteRoute {
    name: string;
    path?: string;
    component?: JSX.Element;
    link?: string;
    action?: () => void;
}

export const routes: WebsiteRoute[] = [
    { name: "Chats", path: "/chats", component: <Chats /> },
    { name: "Friends", path: "/friends", component: <Friend /> },
    { name: "Discover", path: "/discover", component: <Discover /> },
];

export const authRoutes: WebsiteRoute[] = [
    { name: "Login", path: "/login", component: <Login /> },
    { name: "Register", path: "/register", component: <Register /> },
    { name: "Forget Password", path: "/forget", component: <Forget /> },
];

export const supportRoutes: WebsiteRoute[] = [
    { name: "Contact Us", path: "/contact", component: <ContactUs /> },
    { name: "Privacy Policy", path: "/privacy", component: <PrivacyPolicy /> },
    {
        name: "GitHub",
        link: "https://github.com/namdo1225/chat-app",
    },
    { name: "About", path: "/about", component: <About /> },
];

export const socialRoutes: WebsiteRoute[] = [
    {
        name: "My LinkedIn",
        link: "https://www.linkedin.com/in/nam-do-630bb2173/",
    },
    {
        name: "My GitHub",
        link: "https://github.com/namdo1225",
    },
    {
        name: "My Website",
        link: "https://namdo1225.github.io",
    },
    {
        name: "Other Projects",
        link: "https://namdo1225.github.io/project.html",
    },
];

export const profileRoutes: WebsiteRoute[] = [
    {
        name: "Profile",
        path: "/profile",
        component: <Profile />,
    },
    {
        name: "Account",
        path: "/account",
        component: <Account />,
    },
];
