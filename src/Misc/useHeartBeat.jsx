import { useEffect } from "react";

export function useHeartbeat(API_BASE_URL) {
    useEffect(() => {
        const ping = () => {
            fetch(`${API_BASE_URL}/heartbeat`, {
                method: "POST",
                credentials: "include"
            }).catch(() => {});
        };

        ping();
        const interval = setInterval(ping, 30000);
        return () => clearInterval(interval);
    }, [API_BASE_URL]);
}

//This function is constantly called at an interval of around 30s using the const ping.
//Which fetches from an endpoint to return True / False which updates lastseen column.
//Then clearInterval() is called to clear the interval. 

//export function useHeartBeat(API_BASE_URL){
//     useEffect(()=>{
//         const ping = () => {
//             Here is the fetch logic
//         };
//         Here, ping() is called 
//         and an interval is set 
//         then return is called.

//     })
// }