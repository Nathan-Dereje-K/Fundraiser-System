import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useVerifyEmailToken } from "../../hooks/useAuth";
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // React Query mutation for verifying email
  const {
    mutate: verifyEmailToken,
    isPending,
    isError,
    isSuccess,
  } = useVerifyEmailToken();

  useEffect(() => {
    if (token) {
      verifyEmailToken({ token });
    } else {
      setTimeout(() => navigate("/"), 2000);
    }
  }, [token, verifyEmailToken]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => navigate("/"), 2000);
    }
  }, [isSuccess]);

  return (
    <div className="flex justify-center mt-20">
      <div className="text-center p-6 rounded-lg shadow-lg bg-white">
        {isPending && <p className="text-blue-500">Verifying...</p>}

        {isSuccess && (
          <p className="text-green-500">✅ Verified! Redirecting...</p>
        )}
        {isError && <p className="text-red-500">❌ Verification Failed!</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
