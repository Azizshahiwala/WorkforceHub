/*npm install --save @fullcalendar/core @fullcalendar/react @fullcalendar/daygrid @fullcalendar/interaction
*/
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction'; // Necessary for selectable
import './AttendanceMethod2.css';
import {useState,useEffect} from 'react';

export function AttendanceMethod2() {
    
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
    //When event runs, This function from eventClick is triggered instead of
    //dateClick
    const handleEventClick = (info) =>{
        const clickedId = info.event.id;
        const updatedEvents = myEvents.filter(item => {
            //Check if id is not equal to clicked id
            return item.id != clickedId;
        });
        setMyEvents(updatedEvents);
    }
    return (<>
    <div className="attendance-page">
        <p>Attendance</p>
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
                    <span>
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
    </div>
    </>);
}
export default AttendanceMethod2;