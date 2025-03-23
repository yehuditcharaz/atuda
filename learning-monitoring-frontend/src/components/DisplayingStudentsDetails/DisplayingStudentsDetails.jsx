import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from "../../contexts/UserContext/UserContext";
import './DisplayingStudentsDetails.css';
import { getData, postData } from '../../services/axios';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';

const DisplayingStudentsDetails = ({ trainingStudent }) => {
    const toast = useRef(null);
    let currentUser = useContext(UserContext);
    currentUser = currentUser.user;
    const [studentDetails, setStudentDetails] = useState(null);
    const [selectedProfile] = useState(null);
    const [isStudent, setIsStudent] = useState(false);
    const [visible, setVisible] = useState(false)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            let condition = null;
            if (currentUser && currentUser.role === 'מוכשרת') {
                setIsStudent(true);
                condition = `id = '${currentUser.id}'`;
            } else if (trainingStudent) {
                condition = `id = '${trainingStudent.id}'`;
            }
            const data = await findDetails(condition);
            setStudentDetails(data);
        };
        fetchData();
    }, [currentUser, trainingStudent]);

    const findDetails = async (condition) => {
        let temp_studentDetails = {};
        let response;
        response = await getData('user/read', {
            condition: condition
        });
        if (response.status === 200) {
            temp_studentDetails = response.data[0];
        } else {
            temp_studentDetails = { name: null, profile: null, role: null };
        }
        return temp_studentDetails;
    };

    const accept = async () => {
        let updatedStudentDetails = { ...studentDetails };
        updatedStudentDetails.profile = selected;

        setStudentDetails(updatedStudentDetails);

        await postData('user/update', {
            ...updatedStudentDetails
        });
        toast.current.show({ severity: 'info', summary: ',שימי לב', detail: 'פרופיל המוכשרת הוחלף' });
        setVisible(false)
    }

    const handleProfileChange = (temp_selectedProfile) => {
        setSelected(temp_selectedProfile)
        setVisible(true)
    };
    const renderProfileData = () => {
        let profiles = [
            "פרופיל א",
            "פרופיל ב",
            "לא פעילה"
        ];

        if (studentDetails && isStudent) {
            let profileText = studentDetails.profile ? studentDetails.profile : null;
            if (profileText === "פרופיל א" || profileText === "פרופיל ב") {
                profileText = profileText.substring(6);
            }

            return (
                <>
                    {studentDetails && (
                        <div className='profile-card'>
                            <p><strong>שם מוכשרת:</strong> {studentDetails.name}</p>
                            <p><strong>פרופיל:</strong> {profileText}</p>
                        </div>
                    )}
                </>
            );
        } else {
            return (
                <div className='profile-card'>
                    <p className='student-profile'>פרופיל מוכשרת:</p>
                    {studentDetails && (
                        <>
                            <Dropdown
                                value={selectedProfile}
                                onChange={(e) => handleProfileChange(e.value)}
                                options={profiles}
                                placeholder={studentDetails.profile}
                                className="custom-dropdown"
                            />
                        </>
                    )}
                </div>
            );
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog group='declarative' visible={visible}
                onHide={() => setVisible(false)}
                message='?האם את בטוחה שברצונך לשנות פרופיל'
                header='אישור'
                icon='pi pi-info-circle'
                defaultFocus='reject'
                acceptClassName='p-button-danger'
                accept={accept}
                acceptLabel= 'כן'
                rejectLabel= 'לא'
            />
            {renderProfileData()}
        </>
    );
};

export default DisplayingStudentsDetails;