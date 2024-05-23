import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { CAAuth } from "./AuthContext";

const useAuth = (): CAAuth => {
    return useContext<CAAuth>(AuthContext);
};

export default useAuth;
