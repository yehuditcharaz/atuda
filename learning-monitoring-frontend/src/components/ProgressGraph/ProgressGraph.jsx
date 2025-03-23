import React, { useEffect, useState, useRef } from 'react';
import { Chart } from 'primereact/chart';
import { getData, postData } from '../../services/axios';
import AddProgressGraph from '../AddProgressGraph/AddProgressGraph';
import chroma from 'chroma-js';
import './ProgressGraph.css'
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


const ProgressGraph = ({ data_progress, fetchDataFunc, role, allowEdit = false }) => {
    const toast = useRef(null);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [updateGraph, setUpdateGraph] = useState(false);

    const startColor = 'red';
    const endColor = 'green';
    const colorScale = chroma.scale([startColor, endColor]).colors(data_progress.y_array.length);

    const deleteChart = async () => {
        const id = data_progress.id;
        await postData('graphs/delete', { id })
        fetchDataFunc();
        toast.current.show({ severity: 'success', summary: 'אישור', detail: 'המחיקה בוצעה' });
    }

    const handleDeleteChart = async () => {
        confirmDialog({
            message: '?האם את בטוחה שברצונך למחוק שורה זו',
            header: 'אישור מחיקה',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => deleteChart(),
            acceptLabel: 'כן',
            rejectLabel: 'לא',
        });

    };

    const configMenu = useRef(null);
    const items = [
        {
            label: ' עריכה ',
            icon: 'pi pi-pencil',
            disabled: !allowEdit,
            command: () => {
                setUpdateGraph(true)
            }
        },
        {
            separator: true
        },
        {
            label: ' מחיקה ',
            icon: 'pi pi-trash',
            disabled: !allowEdit,
            command: () => handleDeleteChart()
        }
    ];

    function getBorderColor(index) {
        const color = colorScale[index];
        return color;
    };


    useEffect(() => {
        const pushDataSets = (chartData, label, data, value) => {
            chartData.datasets.push({
                label: label,
                data: data,
                fill: false,
                tension: 0.4,
                borderColor: getBorderColor(value)
            });
        };

        const parseIntData = async () => {
            const conditionValueParse = typeof (data_progress.condition_value) == 'number' || isNaN(parseInt(data_progress.condition_value.match(/\d+/))) ? data_progress.condition_value : parseInt(data_progress.condition_value.match(/\d+/));
            data_progress.condition_value = conditionValueParse;
            const xArrayParse = data_progress.x_array.map(value => typeof (value) == 'number' || isNaN(parseInt(value.match(/\d+/))) ? value : parseInt(value.match(/\d+/)[0]));
            data_progress.x_array = xArrayParse;
            const yArrayParse = data_progress.y_array.map(value => typeof (value) == 'number' || isNaN(parseInt(value.match(/\d+/))) ? value : parseInt(value.match(/\d+/)[0]));
            data_progress.y_array = yArrayParse;
        };

        const fetchData = async () => {
            setUpdateGraph(false);
            await parseIntData();
            const data = await getData('progress_trackings/read')

            let chartData = {
                labels: data_progress.x_array,
                datasets: []
            };
            let condition;

            // מעקב בציר ה X
            if (data_progress.x_table_name == 'progress_trackings') {
                const result = await getData(`${data_progress.y_table_name}/read`);
                const resTranslate = await getData(`config/getColumnNames/${data_progress.x_table_name}`);
                chartData.labels = data_progress.x_array.map(itemA => resTranslate.data.columns.find(itemB => itemB.name === itemA)?.translate || 'Translate Not Found')
                const conditionLoop = data_progress.y_table_name == 'task' ? 'task_id' : 'trainig_student_id';
                const find = data_progress.y_table_name == 'task' ? 'label' : 'name';

                data_progress.y_array.forEach(y => {
                    let valueArray = [];
                    data_progress.x_array.forEach(x => {
                        condition = data_progress.condition_field;
                        const value = data.data.find(data => data[conditionLoop] === y && data[condition] === data_progress.condition_value)?.[x] || 0;
                        valueArray.push(value);
                    })
                    pushDataSets(chartData, result.data.find(value => value.id === y)[find], valueArray, y)
                });

            }
            else {
                // מעקב בגרפים
                if (data_progress.y_table_name == 'progress_trackings') {

                    const resTranslate = await getData(`config/getColumnNames/${data_progress.y_table_name}`);
                    const find = data_progress.x_table_name == 'task' ? 'label' : 'name';
                    const resTableData = await getData(`${data_progress.x_table_name}/read`)
                    chartData.labels = data_progress.x_array.map(itemA => resTableData.data.find(itemB => itemB.id === itemA)?.[find] || 'Not Found')

                    const conditionLoop = data_progress.x_table_name == 'task' ? 'task_id' : 'trainig_student_id';
                    data_progress.y_array.forEach(y => {
                        let valueArray = [];
                        data_progress.x_array.forEach(x => {
                            condition = data_progress.condition_field;
                            const value = data.data.find(data => data[conditionLoop] == x && data[condition] === data_progress.condition_value)?.[y] || 0;
                            valueArray.push(value);
                        })
                        pushDataSets(chartData, resTranslate.data.columns.find(value => value.name === y)?.translate || 'Translate Not Found', valueArray, y)

                    })
                }
                // מעקב בתנאי
                else {

                    const resTableDataX = await getData(`${data_progress.x_table_name}/read`);
                    const resTableDataY = await getData(`${data_progress.y_table_name}/read`);
                    const findX = data_progress.x_table_name == 'task' ? 'label' : 'name';
                    const findY = data_progress.y_table_name == 'task' ? 'label' : 'name';

                    chartData.labels = data_progress.x_array.map(itemA => resTableDataX.data.find(itemB => itemB.id === itemA)?.[findX] || 'Not Found')
                    data_progress.y_array.forEach(y => {
                        let valueArray = [];
                        data_progress.x_array.forEach(x => {
                            const value = data.data.find(data => data.trainig_student_id == y && data.task_id == x)?.[data_progress.condition_value] || 0;
                            valueArray.push(value);
                        })
                        pushDataSets(chartData, resTableDataY.data.find(value => value.id === y)?.[findY] || 'Not Found', valueArray, y)
                    })
                }
            };

            const chartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                scales: {
                    x: {
                        ticks: {
                            font: {
                                size: 16
                            }
                        }
                    },
                    y: {
                        ticks: {
                            stepSize: 1,
                            font: {
                                size: 16
                            }
                        }
                    }
                },
            };
            setChartData(chartData);
            setChartOptions(chartOptions);
        }
        fetchData();
    }, [data_progress]);

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="graph-card">
                {role != 'trainingStudent' ?
                    <div className='div-graph-option'>
                        <Menu model={items} popup ref={configMenu} id="config_menu" />
                        <span className="pi pi-ellipsis-h" onClick={(e) => configMenu?.current?.toggle(e)}></span>
                        <span className='graph-date'>{data_progress.date}</span>

                    </div> : ''
                }
                <p>{data_progress.title}</p>
                <div className="graph-container">
                    <Chart type="line" data={chartData} options={chartOptions} />
                </div>
            </div>
            {
                updateGraph ?
                    <div>
                        <AddProgressGraph key={data_progress.id} mode={'update'} data={data_progress} fetchDataFunc={fetchDataFunc}></AddProgressGraph>
                    </div>
                    : ''
            }
        </>

    );
};
export default ProgressGraph;