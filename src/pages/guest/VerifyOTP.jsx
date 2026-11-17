import { Navigate, useLocation } from 'react-router-dom';

export default function VerifyOTP() {
  const { state } = useLocation();
  return <Navigate to="/sign-up" replace state={{ email: state?.email }} />;
}
