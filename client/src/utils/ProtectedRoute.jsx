import { Navigate } from "react-router-dom";

function ProtectedRoute(props) {
  const { redirectPath, isAllowed, children } = props;

  if (!isAllowed) return <Navigate to={redirectPath} replace />;

  return children;
}

export default ProtectedRoute;
