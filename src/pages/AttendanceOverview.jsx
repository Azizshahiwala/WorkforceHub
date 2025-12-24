/*npm install --save @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
*/
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction'; // Necessary for selectable
import { Employees ,UserInfo} from "./CompanyUser";
import './AttendanceOverview.css';
import {useState,useEffect} from 'react';
export function AttendanceOverview() {
    
    //Track if window is open
    const [Window,isWindowVisible] = useState(false);

    //Track if attendancewindow is open
    const [AttendanceWindow,isAttendanceVisible] = useState(false);

    //Track which date is clicked
    const [ClickedDate,setClickeddate] = useState("");

    //We create useState event containing current title, date.
    const [myEvents,setMyEvents]=useState([ 
        {title: 'Today', date: new Date()}
    ]);
    //This function will call event and append it to myEvents list
    const addEvent = (event) =>{
        setMyEvents([...myEvents,event]);
    }

    //This function will run when a date is clicked
    const handleClick = (info) => {
        //dateStr is inbuilt.
        setClickeddate(info.dateStr);
        isWindowVisible(true);
    };
    const ShowAttendance = () => {
        //Use css to layer over submenu
        if(Window){
            isAttendanceVisible(true);
        }
    }
    const SetHoliday = () => {
        const template ={id: Date.now(), title: 'Holiday', date : ClickedDate, color:'blue'}; 
        addEvent(template);
        isWindowVisible(false);  
    }
    //When event runs, This function from eventClick is triggered instead of DateClick
    
    const handleEventClick = (info) =>{
        const clickedId = info.event.id;
        const updatedEvents = myEvents.filter(item => {
            //Check if id is not equal to clicked id
            return item.id != clickedId;
        });
        setMyEvents(updatedEvents);
    }
    

    //Check for Absent and Present using ClickedDate state.
    const PresentList = Employees.filter(emp => emp.status === "Logged In" && emp.lastLogin.includes(ClickedDate));
    
    //backup real time date
    const RealToday = new Date();

    //Check IF (Last login date is bigger than today) -> False if True
    //Check IF (Last login includes diff clicked date) -> False if True
    const AbsentList = Employees.filter(emp => !(new Date(emp.lastLogin) > RealToday) && !(emp.lastLogin.includes(ClickedDate)));
    return (<>
    <div className="attendance-page">
        <h2>Attendance Dashboard</h2>
        <h4>Click on a date for more info</h4>
        {/*Check if window is true with &&*/}
        {Window && (
                <div className="EventWindow">
                    <span>
                    <button onClick={ShowAttendance}>Show attendance</button>
                    <button onClick={SetHoliday}>Mark as Holiday</button>
                    <button onClick={() => isWindowVisible(false)}>Close</button>
                    </span>
                </div>              
            )
            }
            {Window && AttendanceWindow && (
                <div className="AttendanceWindow">
                    <h4>Absent (No Login Today)</h4>
                    <span>
                    <table border={1} className="Absent">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Last Seen</th></tr>
                            </thead>
                            <tbody>
                                {AbsentList.map(emp => 
                                    UserInfo(emp.employeeId, emp.name, emp.lastLogin)
                                )}
                            </tbody>
                    </table>
                    <h4>Present (Logged in {ClickedDate})</h4>
                    <table border={1} className="Present">
                            <thead>
                                <tr><th>ID</th><th>Name</th><th>Login Time</th></tr>
                            </thead>
                            <tbody>
                                {PresentList.map(emp => 
                                    UserInfo(emp.employeeId, emp.name, emp.lastLogin)
                                )}
                            </tbody>
                    </table>
                    <button onClick={() => isAttendanceVisible(false)}>Back</button>
                    </span>
                </div> 
            )}
        <FullCalendar
            plugins={[dayGridPlugin,interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            selectable={true}
            editable={true}
            events={myEvents}
            dateClick={handleClick}
            eventClick={handleEventClick}
        />
        <button>Download CSV Report</button>
    </div>
    </>);
}
export default AttendanceOverview;