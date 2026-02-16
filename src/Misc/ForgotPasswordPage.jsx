import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setemail] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
    const [currentotp, setotp] = useState("");
    const [finalPassword, setfinalPassword] = useState("");
    const [forid, setforid] = useState("");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const userRef = queryParams.get("ref");
        if (userRef) {
            try {
                const decodedEmail = atob(userRef);
                setemail(decodedEmail);
            } catch (e) {
                console.error("Invalid ref parameter", e);
            }
        }
    }, [location]);

    // Step 1: Validate Email
    const validateEmail = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('email', email);
            const response = await fetch(`${API_BASE_URL}/Forgotpassword-process`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.success === true || response.ok) {
                setforid(data.forId); // Ensure we get the raw ID from the tuple
                setStep(2);
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("❌ Email error:", error);
        }
    };

    // Step 2: Verify OTP
    const verifyotp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/getserverOTP`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentotp, forid })
            });
            const data = await response.json();
            if (data.success === true || response.ok) {
                setStep(3);
            } else {
                alert("OTP incorrect.");
            }
        } catch (error) {
            alert("Connection error during OTP verification.");
        }
    };

    // Step 3: Change Password
    const ConfirmPassChange = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/finalize-password-updation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ finalPassword, email })
            });
            const data = await response.json();
            if (data.success === true || response.ok) {
                alert("Password changed successfully. Please login.");
                navigate("/");
            } else {
                alert(data.message || "Failed to update password.");
            }
        } catch (error) {
            alert("Error updating password.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                {step === 1 ? (
                    /* UI for Step 1: Email */
                    <form onSubmit={validateEmail}>
                        <h2>Enter your email</h2>
                        <input type="email" placeholder="email@gmail.com" className="fp-email"
                            onChange={(e) => setemail(e.target.value)} value={email} required />
                        <button type="submit">Send OTP</button>
                    </form>
                ) : step === 2 ? (
                    /* UI for Step 2: OTP */
                    <form onSubmit={verifyotp}>
                        <h2>Verify Identity</h2>
                        <p>A 6 digit OTP has been sent to {email}.</p>
                        <input type="number" placeholder="000000" className="fp-otp"
                            onChange={(e) => setotp(e.target.value)} value={currentotp} required />
                        <button type="submit">Verify</button>
                        <button type="button" onClick={() => setStep(1)} className="back-btn">Back</button>
                    </form>
                ) : (
                    /* UI for Step 3: New Password */
                    <form onSubmit={ConfirmPassChange}>
                        <h2>Set New Password</h2>
                        <input type="password" placeholder="Min 9 characters" className="fp-finalpass"
                            onChange={(e) => setfinalPassword(e.target.value)} value={finalPassword} required />
                        <button type="submit">Change password</button>
                        <button type="button" onClick={() => setStep(2)} className="back-btn">Back</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;