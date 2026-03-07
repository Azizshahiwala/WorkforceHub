import { useNavigate, useSearchParams } from "react-router-dom";
import './Logout.css';
function Logout({SessionName}){
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const currentSession = JSON.parse(localStorage.getItem("MySession"));
    const navigate = useNavigate();
    const removeSession = async (SessionName) => {
        
        if(SessionName === ""){
            setMessage({ type: "Success", text: "Error updating password." });
            alert("Logged out. Please log back in.");
            navigate("/", { replace: true });
        }
        //set in-active status to backend if a user loggedout.
        if (currentSession && currentSession.employeeId) {
        try {

            await fetch(`${API_BASE_URL}/TabCloseLogout`, {
                method: 'POST',
                credentials: "include",
            });
        } catch (error) {
            console.error("Logout status update failed:", error);
        }
    }

        localStorage.removeItem('MySession');
        alert("You have been logged-out.");
        navigate("/", { replace: true, state: { loggedOut: true } });
    }
return(<>
<button className="LogoutBtn" onClick={() => removeSession(SessionName)}>
    Logout
</button>
</>)
}
export default Logout;