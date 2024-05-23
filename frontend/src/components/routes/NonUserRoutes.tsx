import { Navigate, Outlet, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import * as y from "yup";
import { optionalStr } from "@/types/yup";

/**
 * Component to handle routing for need the logged-in user to be blank.
 * @returns {JSX.Element} The React component.
 */
const NonUserRoutes = ({
    user,
}: {
    user: User | null | undefined;
}): JSX.Element => {
    const { state } = useLocation();

    const originalPath = state
        ? y
              .object()
              .shape({ originalPath: optionalStr })
              .nullable()
              .validateSync(state)?.originalPath
        : "";

    return user ? <Navigate to={originalPath ?? "/chats"} /> : <Outlet />;
};

export default NonUserRoutes;
