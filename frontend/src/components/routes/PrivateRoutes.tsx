import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Private route component to ensure private routes are secured.
 * @param {boolean} props.user Whether the user is logged in.
 * @param {boolean} props.session Whether the session exist.
 * @returns The React component.
 */
const PrivateRoutes = ({
    user,
    session,
}: {
    user: boolean;
    session: boolean;
}): JSX.Element => {
    const location = useLocation();

    return user && session ? (
        <Outlet />
    ) : (
        <Navigate to="/login" state={{ originalPath: location.pathname }} />
    );
};

export default PrivateRoutes;
