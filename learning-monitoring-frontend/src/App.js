import './App.css';
import React from 'react';
import Login from './pages/Login/Login.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProgressTracking from './pages/ProgressTracking/ProgressTracking';
import DataSegmentation from './pages/DataSegmentation/DataSegmentation';
import GeneralInformation from './pages/GeneralInformation/GeneralInformation';
import PersonalFile from './pages/PersonalFile/PersonalFile';
import HomePage from './pages/HomePage/HomePage';
import Tasks from './pages/Tasks/Tasks';
import UserContextProvider from './contexts/UserContext/UserContext';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import TaskContextProvider from './contexts/TaskContext/TaskContext';
import AttendanceReportPage from './pages/AttendanceReport/AttendanceReport.jsx';
import TaskNotesContextProvider from './contexts/TaskNotesContext/TaskNotesContext.jsx';
import AttachmentsContextProvider from './contexts/AttachmentsContext/AttachmentsContext';
import AttendanceWeekHoursProvider from './contexts/AttendanceWeekHours/AttendanceWeekHours';
import StatusForm from './components/StatusForm/StatusForm'
import { CookiesProvider } from 'react-cookie';
import StatusTable from './pages/DisplayStatusTable/DisplayStatusTable';
import NotificationContextProvider from './contexts/NotificationContext/NotificationContext';
import Users from './pages/Users/Users';

function App() {
  return (
    <UserContextProvider>
      <TaskContextProvider>
        <TaskNotesContextProvider>
          <AttachmentsContextProvider>
            <AttendanceWeekHoursProvider>
              <NotificationContextProvider>
                <CookiesProvider defaultSetOptions={{ path: '/' }}>
                  <div>
                    <Router>
                      <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/resetPassword" element={<ResetPassword />} />
                        <Route path="/manager">
                          <Route path="/manager/homePage" element={<HomePage user={'manager'} />} />
                          <Route path="/manager/generalInformation" element={<GeneralInformation role={'manager'} />} />
                          <Route path="/manager/users" element={<Users user={'manager'} />} />
                          <Route path="/manager/progressTracking" element={<ProgressTracking user={'manager'} />} />
                          <Route path="/manager/tasksList" element={<Tasks role={'manager'} />} />
                          <Route path="/manager/tasksList/task/:title" element={<Tasks role={'manager'} />} />
                          <Route path="/manager/dataSegmentation" element={<DataSegmentation role={'manager'} />} />
                          <Route path="/manager/personalFile/:student_id" element={<PersonalFile role={'manager'} />} />
                        </Route>
                        <Route path="/mentor">
                          <Route path="/mentor/homePage" element={<HomePage user={'mentor'} />} />
                          <Route path="/mentor/generalInformation" element={<GeneralInformation role={'mentor'} />} />
                          <Route path="/mentor/users" element={<Users user={'mentor'} />} />
                          <Route path="/mentor/progressTracking" element={<ProgressTracking user={'mentor'} />} />
                          <Route path="/mentor/tasksList" element={<Tasks role={'mentor'} />} />
                          <Route path="/mentor/tasksList/task/:title" element={<Tasks role={'mentor'} />} />
                          <Route path="/mentor/dataSegmentation" element={<DataSegmentation role={'mentor'} />} />
                          <Route path="/mentor/personalFile/:student_id" element={<PersonalFile role={'mentor'} />} />
                        </Route>
                        <Route path="/trainingStudent" >
                          <Route path="/trainingStudent/homePage" element={<HomePage user={'trainingStudent'} />} />
                          <Route path="/trainingStudent/generalInformation" element={<GeneralInformation role={'trainingStudent'} />} />
                          <Route path="/trainingStudent/personalFile" element={<PersonalFile role={'trainingStudent'} />} />
                          <Route path="/trainingStudent/dailyStatus" element={<StatusForm role={'trainingStudent'} />} />
                          <Route path="/trainingStudent/attendanceReport" element={<AttendanceReportPage role={'trainingStudent'} />} />
                          <Route path="/trainingStudent/statusHistory" element={<StatusTable role={'trainingStudent'} />} />
                        </Route>
                      </Routes>
                    </Router></div>
                </CookiesProvider>
              </NotificationContextProvider>
            </AttendanceWeekHoursProvider>
          </AttachmentsContextProvider>
        </TaskNotesContextProvider>
      </TaskContextProvider>
    </UserContextProvider>
  );
}

export default App;