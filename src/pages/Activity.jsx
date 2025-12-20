import './Activity.css';
import {FetchEmployeeData} from './CompanyUser.jsx';
import { GetStaffData } from './CompanyUser.jsx';
function Activity(){
    return(<>
    <div className='ActivityHeader'>
        <p>Total Employees : {FetchEmployeeData()}</p>
        <p>Total Staff : {GetStaffData()}</p>
        <p>Total Non-Staff : {FetchEmployeeData() - GetStaffData()}</p>
    </div>            
    <div className='MainContent'>

    </div>
    </>);
}
export default Activity;