import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import { JSX } from "react";
import { routesConfig } from "./routes";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuth();

    if (isAuthenticated === null) return <div>Loading...</div>;
    return isAuthenticated ? children : <Navigate to={routesConfig.dangNhap} replace />;
};

export default ProtectedRoute;