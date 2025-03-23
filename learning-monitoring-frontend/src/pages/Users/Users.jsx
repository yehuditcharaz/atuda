import './Users.css';
import Navigator from '../../components/Navigator/Navigator';
import React, { useState, useEffect, useContext } from 'react';
import { getData } from '../../services/axios';
import DynamicTable from '../../components/DynamicTable/DynamicTable';
import { InputText } from 'primereact/inputtext';
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import DynamicForm from '../../components/DynamicForm/DynamicForm';
import { UserContext } from '../../contexts/UserContext/UserContext';


const Users = (props) => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [profileOptions, setProfileOptions] = useState([]);
    const [mentorList, setMentorsList] = useState([]);
    const [formKey, setFormKey] = useState(0);
    const { user } = useContext(UserContext)
    const fetchData = async () => {
        try {
            let usersResponse = await getData('user/read');
            usersResponse = usersResponse.data.map(item => item.start_date ? { ...item, start_date: item.start_date.substring(0, 10) } : item);
            if (usersResponse?.length > 0) {
                usersResponse = usersResponse.map(user => user.role == 'מוכשרת' ? { ...user, mentor_id: { id: user.mentor_id, value: usersResponse.find(u => u.id == user.mentor_id)?.name } } : user);
                setUsers(usersResponse);
            } else {
                console.error('Error: Missing data in the response.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getProfileOptions = async () => {
        try {
            const response = await getData('config/getEnumValues/users/profile');
            setProfileOptions(response.data.values);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getMentorsList = async () => {
        try {
            const response = await getData('user/read', { select: ['id', 'name'], condition: `role='מנטור'` });
            setMentorsList(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSearch = (event) => {
        const searchText = event.target.value;
        setSearchText(searchText);
    };
    const filterData = (role) => {
        const filterUserByRole = users.filter(user => (user.role === role)).filter(item => props.user == 'mentor' ? (item.mentor_id.id === user.id) : item).map(user => (user.role == 'מוכשרת' ? { id: user.id, name: user.name, email: user.email, user_name: user.user_name, phone: user.phone, mentor_id: user.mentor_id, start_date: user.start_date, profile: user.profile, address: user.address, place_of_study: user.place_of_study, study_year: user.study_year } :
            { id: user.id, name: user.name, email: user.email, user_name: user.user_name, phone: user.phone }));
        return searchText != '' ? filterUserByRole.filter(user =>
            Object.values(user).some(value =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
            )
        ) : filterUserByRole;
    }
    const edit = (role) => {
        const ans = filterData(role);
        let editArr = Array(ans.length).fill(true);
        editArr = ans.map(user => user.id);
        return editArr
    }
    const freeSearch = () => {
        return (
            <div className="user-search">
                <div className="inputsearch">
                    <InputText className='input' value={searchText} onChange={handleSearch} placeholder="הזן ערך לחיפוש" />
                    <span id='icon' className='pi pi-search'></span>
                </div>
                {props.user == 'mentor' ? '' : <div className="btnadd">
                    <Button label="הוספה" severity="secondary" text raised className="add" onClick={() => handleAddButtonClick()} />
                </div>}
            </div>
        );
    };

    const handleAddButtonClick = () => {
        setShowForm(true);
        setFormKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        fetchData();
        getProfileOptions();
        getMentorsList();
    }, []);

    return (
        <>
            <Navigator user={props.user} />
            {props.user == 'mentor' ?

                <div className="TabPanel">
                    {freeSearch()}
                    {filterData('מוכשרת')?.length ?
                        <DynamicTable
                            className='table-panel'
                            data={filterData('מוכשרת')}
                            tableName='users'
                            routerName='user'
                            edit={edit('מוכשרת')}
                            fetchData={fetchData}
                            elements={{
                                profile: <Dropdown options={profileOptions.map(option => option.value)} />,
                                mentor_id: <Dropdown options={mentorList.map(option => ({
                                    label: option.name,
                                    value: option.id
                                }))} />
                            }}
                        /> : ''}
                </div> : <div className="tabim user-tabim">
                    {showForm ? <DynamicForm key={formKey} table_name={'users'} route_name={'user'} fetchData={fetchData} initializeFormData={{start_date: new Date().toISOString().slice(0, 10)}}></DynamicForm> : ''}
                    <TabView className='TabView'>
                        <TabPanel className='TabPanel' header="מנהל">
                            {freeSearch()}
                            {filterData('מנהל')?.length ? <DynamicTable
                                className='table-panel'
                                data={filterData('מנהל')}
                                tableName='users'
                                routerName='user'
                                edit={edit('מנהל')}
                                elements={{
                                    profile: <Dropdown options={profileOptions.map(option => option.value)} />
                                }}
                                fetchData={fetchData}
                            /> : ''}
                        </TabPanel>
                        <TabPanel className='TabPanel' header="מנטור">
                            {freeSearch()}
                            {filterData('מנטור')?.length ? <DynamicTable
                                className='table-panel'
                                data={filterData('מנטור')}
                                tableName='users'
                                routerName='user'
                                edit={edit('מנטור')}
                                elements={{
                                    profile: <Dropdown options={profileOptions.map(option => option.value)} />
                                }}
                                fetchData={fetchData}
                            /> : ''}
                        </TabPanel>
                        <TabPanel className='TabPanel' header="מוכשרת">
                            {freeSearch()}
                            {filterData('מוכשרת')?.length ? <DynamicTable
                                className='table-panel'
                                data={filterData('מוכשרת')}
                                tableName='users'
                                routerName='user'
                                edit={edit('מוכשרת')}
                                elements={{
                                    profile: <Dropdown options={profileOptions.map(option => option.value)} />,
                                    mentor_id: <Dropdown options={mentorList.map(option => ({
                                        label: option.name,
                                        value: option.id
                                    }))} />
                                }}
                                fetchData={fetchData}
                            /> : ''}
                        </TabPanel>
                    </TabView>
                </div>
            }
        </>
    );
};

export default Users;