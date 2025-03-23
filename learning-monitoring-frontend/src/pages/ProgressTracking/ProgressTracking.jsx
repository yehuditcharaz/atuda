import React from 'react';
import './ProgressTracking.css'
import Navigator from '../../components/Navigator/Navigator';
import ProgressTrackingTable from '../../components/ProgressTrackingTable/ProgressTrackingTable';

const ProgressTracking = ({ user }) => {

    return (
        <>
            <Navigator user={user} />
            <div className='progress-file'>
                <ProgressTrackingTable></ProgressTrackingTable>
            </div>
        </>
    );
};
export default ProgressTracking