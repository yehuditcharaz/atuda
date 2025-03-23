import React, { useState, useContext, useEffect, useCallback } from 'react';
import { getData } from '../../services/axios';
import { TaskContext } from '../../contexts/TaskContext/TaskContext';
import DynamicTable from '../DynamicTable/DynamicTable';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import DynamicForm from '../DynamicForm/DynamicForm';
import './CodeReview.css'
import { UserContext } from '../../contexts/UserContext/UserContext';
import { Editor } from 'primereact/editor';

const CodeReview = () => {
    const { user } = useContext(UserContext);
    const { task } = useContext(TaskContext);
    const [review, setReview] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterReview, setFilterReview] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [tags, setTags] = useState([]);
    const [tag] = useState('');
    const [formKey, setFormKey] = useState(0);

    const extractTextFromHTML = (html) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };
    
    const handleSearch = (event) => {
        const searchText = event.target.value;
        setSearchText(searchText);
        if (searchText) {
            const filteredData = review.filter(row => {
                const valuesToSearch =
                    [row.date,
                    row.mentor_id.value,
                    row.sentence.value,
                    row.tag.value];
                return valuesToSearch.some(value =>
                    extractTextFromHTML(String(value)).toLowerCase().includes(searchText.toLowerCase())
                )
            }
            );
            setFilterReview(filteredData);
        } else {
            setFilterReview(review);
        }
    };

    const getColorByIndex = (index) => {
        const hue = (360 * index / 10) % 360;
        const saturation = 50;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const generateColorArray = (tags) => {
        const tagsColors = tags.map((tag, index) => ({ value: tag.value, tag: <Tag className='tag-level' value={tag.value} style={{ backgroundColor: getColorByIndex(index) }}></Tag> }))
        return tagsColors
    };

    const fetchReviewData = useCallback(async () => {
        const condition = `task_id=${task.id}`;
        let response = await getData('codeReview/read', { condition: condition, select: ['id', 'mentor_id', 'sentence', 'tag', 'date'] });
        let users = await getData('user/read');
        const enumValues = await getData('config/getEnumValues/code_reviews/tag');
        const tagsColors = generateColorArray(enumValues.data.values);
        setTags(tagsColors);
        const updatedReview = response.data.map(item => {
            return {
                ...item, mentor_id: { id: item.mentor_id, value: users.data.find(user => user.id == item.mentor_id)?.name }, date: item.date.substring(0, 10), tag: { element: item.tag == null ? tagsColors[0].tag : tagsColors.find(tag => tag.value === item.tag)?.tag, value: item.tag }, sentence: { value: item.sentence, element: <div dangerouslySetInnerHTML={{ __html: item.sentence }} /> }
            }
        });
        setReview(updatedReview);
        setFilterReview(updatedReview);
    }, [task.id])

    const edit = () => {
        const ans = user.role === 'מנהל' ? review.map(rev => rev.id) : review.filter(rev => rev.mentor_id == user.id).length ? review.map(rev => (rev.mentor_id == user.id ? rev.id : 0)) : [];
        return ans
    }

    const handleAddButtonClick = () => {
        setShowForm(true);
        setFormKey(prevKey => prevKey + 1);
    };

    useEffect(() => {
        fetchReviewData();
    }, [fetchReviewData]);

    return (
        <div>
            <div className='code-reviews'>
                <div className='add-and-search-reviews'>
                    <div className='inputsearch'>
                        <InputText className="input" type="text" placeholder='הזן ערך לחיפוש' value={searchText} onChange={handleSearch} />
                        <span id='icon' className='pi pi-search'></span>
                    </div>
                    <div className='btnadd'>
                        <Button label="הוספה" severity="secondary" text raised className='add' onClick={() => handleAddButtonClick()} />
                    </div>

                </div>
                {showForm ? <DynamicForm key={formKey} table_name={'code_reviews'} route_name={'codeReview'} fetchData={fetchReviewData}></DynamicForm> : ''}

                {filterReview?.length ? <DynamicTable
                    data={filterReview ? filterReview : review}
                    tableName='code_reviews'
                    routerName='codeReview'
                    edit={edit()}
                    elements={{
                        tag: <Dropdown className='drop' value={tag} options={tags.map(tag => tag.value)} itemTemplate={(option) => { return <Tag className='tag-level' value={option} style={{ backgroundColor: getColorByIndex(tags.map(tag => tag.value).indexOf(option)) }}></Tag> }} optionLabel="value" checkmark={true} highlightOnSelect={false} />,
                        sentence: <Editor className='editor-table' value='' />
                    }}
                    fetchData={fetchReviewData}
                    disabledColumns={['mentor_id', 'date']}
                /> : ''}
            </div>
        </div>
    );
};

export default CodeReview;