import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getData } from '../../services/axios';
import { UserContext } from '../../contexts/UserContext/UserContext';
import DynamicForm from '../DynamicForm/DynamicForm';
import DynamicTable from '../DynamicTable/DynamicTable';
import StarRathingInfo from '../StarRathingInfo/StarRathingInfo';
import { Button } from 'primereact';
import { Toast } from 'primereact/toast';
import { Rating } from 'primereact/rating';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import './Evaluations.css';


const Evaluations = ({ trainig_student }) => {
    const location = useLocation();
    const toast = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const { user } = useContext(UserContext);
    const [evaluationsList, setEvaluationsList] = useState([]);
    const [elements, setElements] = useState({});
    const [filterEvaluations, setFilterEvaluations] = useState(null);
    const [searchText, setSearchText] = useState('');

    const fetchEvaluations = useCallback(async () => {
        try {
            const condition = `trainig_student_id=${trainig_student.id}`;
            let evaluationsData = await getData('evaluations/read', { condition: condition })
            evaluationsData = evaluationsData.data;
            const writers = await getData('user/read');
            let evaluationsLabels = await getData(`/config/getTable/evaluations`);
            evaluationsLabels = evaluationsLabels.data.columns.filter(column => column.type == 'INT DEFAULT 0')?.map(column => column.name);
            let elementsItems = {};
            evaluationsLabels.map(label => {
                elementsItems[label] = <Rating stars={6} cancel={false} value={0} />;
            });
            setElements({ ...elementsItems, evaluation: <InputTextarea autoResize value='' rows={2} cols={30} /> });
            evaluationsData = evaluationsData.map(evaluation => {
                let newEvaluation = evaluation;
                newEvaluation.writer_id = typeof evaluation.writer_id == 'number' ? { id: evaluation.writer_id, value: writers.data.find(writer => writer.id == evaluation.writer_id)?.name } : evaluation.writer_id;
                newEvaluation.date = evaluation.date.slice(0, 10);
                newEvaluation.evaluation = { value: evaluation.evaluation ? evaluation.evaluation : '', element: <InputTextarea className='text-evaluation' autoResize disabled value={evaluation.evaluation ? evaluation.evaluation : ''} rows={2} cols={30} /> };
                evaluationsLabels.map(label => {
                    newEvaluation[label] = { value: evaluation[label], element: <Rating stars={6} value={evaluation[label]} cancel={false} /> }
                });
                return newEvaluation;
            })
            setEvaluationsList(evaluationsData);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        }
    }, [trainig_student.id]);

    useEffect(() => {
        fetchEvaluations();
    }, [fetchEvaluations]);

    const handleAddButtonClick = () => {
        const currentMonth = new Date().getMonth();
        if (evaluationsList.find(evaluation => new Date(evaluation.date).getMonth() == currentMonth)) {
            toast.current.show({ severity: 'warn', summary: 'שימי לב!', detail: 'קיימת הערכה עבור החודש הנוכחי,ניתן לערוך את הערכה הקיימת.', life: 5000 })
        }
        else {
            setShowForm(true);
            setFormKey(prevKey => prevKey + 1);
        }
    };

    const edit = () => {
        const ans = user.role === 'מנהל' ? evaluationsList.map(item => item.id) : evaluationsList.map(item => (item.writer_id.id == user.id ? item.id : 0));
        return ans
    }

    const handleSearch = (event) => {
        const searchText = event.target.value;
        setSearchText(searchText);
        if (searchText) {
            const filteredData = evaluationsList.filter(row =>
                Object.values(row).some(value =>
                    String(value.value ? value.value : value).toLowerCase().includes(searchText.toLowerCase())
                )
            );
            setFilterEvaluations(filteredData);
        } else {
            setFilterEvaluations(null);
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <div className='add-and-search-evaluations'>
                <div className='inputsearch'>
                    <InputText className="input" type="text" placeholder='הזן ערך לחיפוש' value={searchText} onChange={handleSearch} />
                    <span id='icon' className='pi pi-search'></span>
                </div>
                <div className='btnadd'>
                    <Button label="הוספה" severity="secondary" text raised className='add' onClick={() => handleAddButtonClick()} />
                </div>
            </div>
            {showForm ? <DynamicForm key={formKey} table_name={'evaluations'} route_name={'evaluations'} fetchData={fetchEvaluations} initializeFormData={{ trainig_student_id: trainig_student.id, writer_id: user.id, date: new Date().toISOString().slice(0, 10), link: location.pathname }}></DynamicForm> : ''}
            {filterEvaluations?.length || evaluationsList?.length ? <div>
                <DynamicTable
                    data={filterEvaluations ? filterEvaluations : evaluationsList}
                    tableName='evaluations'
                    routerName='evaluations'
                    edit={!filterEvaluations || filterEvaluations.length ? edit() : []}
                    elements={elements}
                    fetchData={fetchEvaluations} 
                    disabledColumns={['writer_id', 'date']}
                />
            </div> : ''}
            <StarRathingInfo />
        </>
    );
};

export default Evaluations;