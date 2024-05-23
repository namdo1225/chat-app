import "./App.css";
import MainRoutes from "@/components/routes/MainRoutes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/config/queryClient";

/**
 * App component serving as the entry component for the web app.
 * @returns {JSX.Element} The React component.
 */
const App = (): JSX.Element => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster />
                <AuthProvider>
                    <MainRoutes />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
