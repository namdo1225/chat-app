import { Routes, Route, Navigate } from "react-router-dom";
import { routes, authRoutes, supportRoutes, profileRoutes } from "../../routes";
import PrivateRoutes from "@/components/routes/PrivateRoutes";
import NonUserRoutes from "@/components/routes/NonUserRoutes";
import Navbar from "@/components/navigations/Navbar";
import Footer from "@/components/navigations/Footer";
import ResetPassword from "@/components/pages/authentication/ResetPassword";
import Home from "@/components/pages/Home";
import useAuth from "@/context/useAuth";

/**
 * Component to handle routing for general (non-user and non-private) routes.
 * @returns {JSX.Element} The React component.
 */
const MainRoutes = (): JSX.Element => {
    const { user, session } = useAuth();

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<NonUserRoutes user={user} />}>
                    {authRoutes.map((route) => (
                        <Route
                            path={route.path}
                            key={route.path}
                            element={route.component}
                        />
                    ))}
                </Route>
                <Route
                    element={
                        <PrivateRoutes user={!!user} session={!!session} />
                    }
                >
                    {[...routes, ...profileRoutes].map((route) => (
                        <Route
                            path={route.path}
                            key={route.path}
                            element={route.component}
                        />
                    ))}
                </Route>
                <Route path="/resetpassword" element={<ResetPassword />} />
                {supportRoutes.map(
                    (route) =>
                        route.path && (
                            <Route
                                path={route.path}
                                key={route.path}
                                element={route.component}
                            />
                        )
                )}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
        </>
    );
};
export default MainRoutes;
