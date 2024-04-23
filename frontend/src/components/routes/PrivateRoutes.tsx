import { Navigate, Outlet, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";

const PrivateRoutes = ({user}: {user: User | null | undefined}) => {
    const location = useLocation();

    return user ? <Outlet /> : <Navigate to="/login" state={{ originalPath: location.pathname }} />;
};

export default PrivateRoutes;
