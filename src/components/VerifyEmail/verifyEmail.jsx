import { useEffect, useState } from "react";
import { verifyEmail } from "../../services/auth";
import { Link, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      verifyEmail(token)
        .then((res) => {
          setMessage(res.message || "Email verification successful!");
        })
        .catch((err) => {
          setMessage(err || "Authentication failed.");
        });
    } else {
      setMessage("Authentication token not found.");
    }
  }, [searchParams]);

  return (
    <div
      style={{
        padding: 20,
        margin: "auto",
        textAlign: "center",
        height: "50vh",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>{message}</h2>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <p
          style={{
            fontSize: "15px",
            marginTop: "10px",
            textDecoration: "none",
          }}
        >
          Go to Login
        </p>
      </Link>
    </div>
  );
};

export default VerifyEmail;
