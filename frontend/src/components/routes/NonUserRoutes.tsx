import { Navigate, Outlet, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";

const NonUserRoutes = ({user}: {user: User | null | undefined}) => {
    const location = useLocation();

    return user ? (
        <Navigate
            to={
                location.state && location.state.originalPath
                    ? location.state.originalPath
                    : "/chats"
            }
        />
    ) : (
        <Outlet />
    );
};

export default NonUserRoutes;
