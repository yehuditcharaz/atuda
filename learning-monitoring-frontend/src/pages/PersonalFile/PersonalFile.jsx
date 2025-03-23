import React, { useState, useContext, useEffect } from 'react';
import './PersonalFile.css';
import Navigator from '../../components/Navigator/Navigator';
import { getData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { TabView, TabPanel } from 'primereact/tabview';
import { useParams } from 'react-router-dom';
import TaskSequence from '../../components/TaskSequence/TaskSequence'
import Feedback from '../../components/Feedback/Feedback';
import StatusTable from '../DisplayStatusTable/DisplayStatusTable';
import AttendanceReport from '../AttendanceReport/AttendanceReport';
import DisplayingStudentsDetails from '../../components/DisplayingStudentsDetails/DisplayingStudentsDetails';
import DataSegmentation from '../DataSegmentation/DataSegmentation';
import Evaluations from '../../components/Evaluations/Evaluations';
import FinishTask from '../../components/FinishTask/FinishTask';
import TasksFeedback from '../../components/TasksFeedback/TasksFeedback';

const PersonalFile = ({ role }) => {
  let { student_id } = useParams();
  const [progress, setProgress] = useState();
  const [trainingStudent, setTrainingStudent] = useState();
  const [feedbackList, setFeedbackList] = useState([]);
  const { user } = useContext(UserContext);
  student_id = student_id || user?.id;

  const fetchFeedbacks = async () => {
    try {
      const condition = `trainig_student_id=${student_id}`;
      const feedbacks = await getData('feedback/read', { condition: condition })
      setFeedbackList(feedbacks.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const dataResponse = await getData('progress_trackings/read');
        setProgress(dataResponse.data);
        const response = await getData('user/read', { condition: `id=${student_id}` });
        setTrainingStudent(response.data[0])
      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
    fetchFeedbacks();
  }, []);

  const renderComponent = (condition, Component, props) => condition && <Component {...props} />;

  const tabItems = [
    { header: "טבלת מעקב", component: FinishTask, props: { trainingStudent }, condition: trainingStudent },
    { header: "ציר התקדמות", component: TaskSequence, props: { trainingStudent: trainingStudent, progress: progress }, condition: trainingStudent },
    { header: "פידבק", component: Feedback, props: { trainig_student: trainingStudent }, condition: trainingStudent },
    { header: "פילוחי נתונים", component: DataSegmentation, props: { role: role, trainingStudent: trainingStudent }, condition: trainingStudent },
    { header: "צפיה בדוח נוכחות", component: AttendanceReport, props: { trainingStudent, role: role }, condition: trainingStudent },
    { header: "צפיה בסטטוס", component: StatusTable, props: { trainingStudent: trainingStudent, role: role }, condition: trainingStudent },
    { header: "הערכה כללית", component: Evaluations, props: { trainig_student: trainingStudent }, condition: trainingStudent },
    { header: "משוב על משימות", component: TasksFeedback, props: { trainig_student: trainingStudent }, condition: trainingStudent },

  ]
  let sections = [
    { title: 'ציר התקדמות', component: progress && <TaskSequence progress={progress} /> },
    { title: 'פילוחי נתונים', component: trainingStudent && <DataSegmentation role={'trainingStudent'} trainingStudent={trainingStudent}></DataSegmentation> },

  ]
  if (feedbackList.length) {
    sections.push({ title: 'פידבקים', component: trainingStudent && <Feedback trainig_student={trainingStudent} feedbackData={feedbackList} /> });
  }

  return (
    <>
      <Navigator user={role} student_id={student_id} />
      <div className='personal-file'>
        <div> <DisplayingStudentsDetails trainingStudent={{ id: student_id }} /></div>
        {role !== 'trainingStudent' ?
          <div className='out'>
            <TabView>
              {tabItems.map(({ header, component, props, condition }) => (
                <TabPanel key={header} header={header}>
                  {renderComponent(condition, component, props)}
                </TabPanel>
              ))}
            </TabView>
          </div> :
          <div className={feedbackList.length ? 'grid-container-3' : 'grid-container-2'}>
            {sections.map((section, index) => (
              <div className="column" key={index}>
                <h3>{section.title}</h3>
                {section.component}
              </div>
            ))}
          </div>
        }
      </div>

    </>
  );
}
export default PersonalFile