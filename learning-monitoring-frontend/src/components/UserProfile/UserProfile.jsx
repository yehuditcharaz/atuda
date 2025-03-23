import React, { useState, useContext, useRef } from 'react';
import { Avatar } from 'primereact/avatar';
import 'primeicons/primeicons.css';
import './UserProfile.css';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { UserContext } from '../../contexts/UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import { postData } from "../../services/axios";
import { Toast } from 'primereact/toast';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableUser, setEditableUser] = useState({ ...user });
    const toast = useRef(null);

    const signOut = () => {
        navigate('/');
        setUser(undefined);
    };

    const getFirstLetter = (name) => {
        return name ? name.charAt(0) : '';
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            await postData('user/update', editableUser)
            toast.current.show({ severity: 'success', summary: 'אישור', detail: 'הפרופיל עודכן בהצלחה' })
            setUser(editableUser);
        } catch (error) {
            setEditableUser(user);
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'שגיאה בעדכון הפרופיל' })
        }
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser({ ...editableUser, [name]: value });
    };

    return (
        <>
            <Toast ref={toast} />
            <div className="side-container">
                <Sidebar className='sidebar-user-profile' visible={visible} position="right" onHide={() => {
                    setVisible(false)
                    setIsEditing(false)
                }} >
                    <div>
                        {isEditing ? (
                            <div style={{ display: "flex" }}>
                                <Button className="save-button" icon="pi pi-check" onClick={handleSave} />
                                <Button className="save-button" icon="pi pi-times" onClick={() => setIsEditing(false)} />
                            </div>
                        ) : (
                            <Button className="edit-button" icon="pi pi-pencil" onClick={handleEdit} />
                        )}
                    </div>
                    <div className='detail'>
                        <label className="details">{editableUser.name}
                            <i className="pi pi-users"></i>
                        </label>
                    </div>
                    <div className='detail'>
                        <label className="details">{editableUser.role}
                            <i className="pi pi-briefcase"></i>
                        </label>
                    </div>
                    <div className='detail'>
                        <label className="details">
                            {isEditing ? (
                                <input type="text" name="email" value={editableUser.email} onChange={handleChange} />
                            ) : (
                                user.email
                            )}
                            <i className="pi pi-at"></i>
                        </label>
                    </div>
                    <div className='detail'>
                        <label className="details">
                            {isEditing ? (
                                <input type="text" name="phone" value={editableUser.phone} onChange={handleChange} />
                            ) : (
                                user.phone
                            )}
                            <i className="pi pi-phone"></i>
                        </label>
                    </div>


                    <Button label="יציאה" className='sign-out-button' icon="pi pi-sign-out" severity="secondary" onClick={signOut} />
                </Sidebar>
                <Avatar icon='pi' id="button" onClick={() => setVisible(true)}>{getFirstLetter(editableUser.name)}</Avatar>
            </div>
        </>
    );
};

export default UserProfile;
