import "./App.css";
import MainRoutes from "./components/routes/MainRoutes";
import AuthProvider from "@/context/AuthProvider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
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
