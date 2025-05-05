import { Ghost } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./notFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <Ghost className="notfound-icon" />
      <h1 className="notfound-title">404 - Page Not Found</h1>
      <p className="notfound-description">
        The page you are looking for does not exist or has been moved.
      </p>
      <button className="notfound-button" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
