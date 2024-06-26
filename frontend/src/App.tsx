import "./App.css";
import MainRoutes from "@/components/routes/MainRoutes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, persister } from "@/config/queryClient";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
import { NODE_ENV } from "./config/config";
import DevInfo from "./components/DevInfo";

/**
 * App component serving as the entry component for the web app.
 * @returns {JSX.Element} The React component.
 */
const App = (): JSX.Element => {
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister,
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) => {
                        const queryIsReadyForPersistance =
                            query.state.status === "success";
                        if (queryIsReadyForPersistance) {
                            const { queryKey } = query;
                            const excludeFromPersisting = queryKey.find((q) => {
                                if (typeof q === "string")
                                    return (
                                        q.includes("MSG") ||
                                        q.includes("INFINITE") ||
                                        q.includes("MEMBERS")
                                    );
                                return true;
                            });
                            return !excludeFromPersisting;
                        }
                        return queryIsReadyForPersistance;
                    },
                },
            }}
        >
            <BrowserRouter>
                <ScrollToTop />
                <Toaster />
                <AuthProvider>
                    <MainRoutes />
                </AuthProvider>
            </BrowserRouter>
            <BackToTop />
            {NODE_ENV !== "production" && <DevInfo />}
        </PersistQueryClientProvider>
    );
};

export default App;
