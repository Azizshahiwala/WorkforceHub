import { useNavigate } from "react-router-dom";
import './Logout.css';
function Logout({SessionName}){
    const navigate = useNavigate();
    const removeSession = (SessionName) => {
        if(SessionName === ""){
            alert("Logged out. Please log back in.");
            navigate("/", { replace: true });
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