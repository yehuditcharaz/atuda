import React from 'react';
import './IconWaiting.css'
import 'primeicons/primeicons.css';

const IconWaiting = ({ loading }) => {

    return (
        <div className={loading ? 'waiting-overlay' : ''}>
            {loading && (
                <div className="icon-container">
                    <i className="pi pi-spin pi-spinner"></i>
                </div>
            )}
        </div>
    );
};

export default IconWaiting;