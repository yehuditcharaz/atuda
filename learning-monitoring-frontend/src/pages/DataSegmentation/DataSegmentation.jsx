import React, { useEffect, useState, useContext } from 'react';
import './DataSegmentation.css'
import Navigator from '../../components/Navigator/Navigator';
import { getData } from '../../services/axios';
import ProgressGraph from '../../components/ProgressGraph/ProgressGraph';
import AddProgressGraph from '../../components/AddProgressGraph/AddProgressGraph';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';
import { UserContext } from '../../contexts/UserContext/UserContext';

const DataSegmentation = ({ role, trainingStudent }) => {
    const { user } = useContext(UserContext);
    const [graphs, setGraphs] = useState([])
    const [addGraph, setAddGraph] = useState(false);
    const [formKey, setFormKey] = useState(0);

    const itemTemplate = (item) => {
        const currentIndex = graphs.findIndex((graph) => graph === item);
        return (
            <div className="graph-container">
                {role === 'trainingStudent' ?
                    <ProgressGraph data_progress={item} fetchDataFunc={fetchData} role={'trainingStudent'}></ProgressGraph>
                    :
                    graphs.slice(currentIndex, currentIndex + 3).map((graph, i) => (
                        <ProgressGraph key={i} data_progress={graph} fetchDataFunc={fetchData} allowEdit={graph.owner_id == user.id}></ProgressGraph>
                    ))
                }
            </div>
        );
    };

    const fetchData = async () => {
        const graphData = [];
        let response = [];
        let condition = null;
        if (role === 'trainingStudent') {
            condition = `training_student_id=${trainingStudent?.id} AND display_for_training_student=true`;
        }
        else {
            if (trainingStudent) {
                condition = `training_student_id=${trainingStudent.id}`
                if (role == 'mentor') {
                    condition += ` and owner_id=${user.id}`
                }
            }
            if (role == 'mentor' && condition == null) {
                condition = `owner_id=${user.id}`
            }
        }
        response = await getData('graphs/read', { condition: condition })
        for (const graph of response.data) {
            graphData.push(graph);
        }
        setGraphs(graphData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddGraph = () => {
        setAddGraph(true);
        setFormKey(prevKey => prevKey + 1);
    }

    return (
        <>
            <div className='segmentation-page'>
                {
                    trainingStudent ? null : <Navigator user={role} />
                }
                {role != 'trainingStudent' ?
                    <div className='btnadd add-graph'>
                        <Button label="הוספה" severity="secondary" text raised className='add' onClick={handleAddGraph} />
                    </div> : ''
                }
                {addGraph ? <AddProgressGraph key={formKey} training_student_id={trainingStudent ? trainingStudent.id : null} fetchDataFunc={fetchData}></AddProgressGraph> : ''}
                {graphs.length > 0 ?
                    <div className="card-galleria">
                        <Galleria
                            value={graphs}
                            numVisible={3}
                            circular
                            showThumbnails={false}
                            showItemNavigators
                            item={itemTemplate}
                        />
                    </div>
                    : ''}
            </div>

        </>
    );
};
export default DataSegmentation