import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { encodeTableUrl } from "../utils/qrEncoding";

/**
 * Redirects old format URLs (/location/tableName) to new encoded format
 * Example: /2/14 → /MnwxNHx...
 */
export default function RedirectPage() {
  const navigate = useNavigate();
  const { location, tableName } = useParams<{
    location: string;
    tableName: string;
  }>();

  useEffect(() => {
    if (location && tableName) {
      const locationNum = parseInt(location, 10);

      // Validate location and tableName
      if (!isNaN(locationNum) && tableName) {
        // Encode and redirect
        const encoded = encodeTableUrl(locationNum, tableName);
        navigate(`/${encoded}`, { replace: true });
      } else {
        // Invalid format, go to home/404
        navigate("/", { replace: true });
      }
    }
  }, [location, tableName, navigate]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-cream-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dark-brown mx-auto mb-4"></div>
        <p className="text-lg font-merriweather text-dark-brown">
          Yönlendiriliyor...
        </p>
      </div>
    </div>
  );
}
