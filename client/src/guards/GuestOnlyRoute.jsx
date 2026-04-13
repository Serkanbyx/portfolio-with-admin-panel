import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/ui/Spinner";

const GuestOnlyRoute = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) return <Spinner fullScreen size="lg" />;

  if (isAdmin) return <Navigate to="/admin" replace />;

  return <Outlet />;
};

export default GuestOnlyRoute;
