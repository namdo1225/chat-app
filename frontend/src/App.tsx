import "./App.css";
import MainRoutes from "@/components/routes/MainRoutes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, persister } from "@/config/queryClient";

/**
 * App component serving as the entry component for the web app.
 * @returns {JSX.Element} The React component.
 */
const App = (): JSX.Element => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
            <BrowserRouter>
                <Toaster />
                <AuthProvider>
                    <MainRoutes />
                </AuthProvider>
            </BrowserRouter>
        </PersistQueryClientProvider>
    );
};

export default App;
