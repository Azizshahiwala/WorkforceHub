import { useNavigate } from "react-router-dom";
import './Logout.css';
function Logout({SessionName}){
    const currentSession = JSON.parse(localStorage.getItem("MySession"));
    const navigate = useNavigate();
    const removeSession = async (SessionName) => {
        
        if(SessionName === ""){
            alert("Logged out. Please log back in.");
            navigate("/", { replace: true });
        }
        //set in-active status to backend if a user loggedout.
        if (currentSession && currentSession.employeeId) {
        try {
            // TRIGER the status update immediately for manual logout
            await fetch(`${API_BASE_URL}/TabCloseLogout/${currentSession.employeeId}`, {
                method: 'POST'
            });
        } catch (error) {
            console.error("Logout status update failed:", error);
        }
    }

        localStorage.removeItem('MySession');
        alert("You have been logged-out.");
        navigate("/", { replace: true });
    }
return(<>
<button className="LogoutBtn" onClick={() => removeSession(SessionName)}>
    Logout
</button>
</>)
}
export default Logout;