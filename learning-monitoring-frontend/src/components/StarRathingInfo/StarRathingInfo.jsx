import React, { useRef, useState } from 'react';
import './StarRathingInfo.css'
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { OverlayPanel } from 'primereact/overlaypanel';

const StarRathingInfo = () => {
    const [starsRathing ] = useState(['לא רלוונטי', 'כלל לא', 'במידה מועטה', 'דרוש שיפור', 'במידה בינונית', 'במידה רבה', 'במידה רבה מאד']);
    const ref = useRef(null);
    return (
        <>
            <div className='wrap-star-rating'>
                <Button className='star-info-btn' label="אפשרויות דירוג" icon="pi pi-star" iconPos="left" onClick={(e) => ref.current.toggle(e)} text />
                <OverlayPanel ref={ref}>
                    <div className='wrap-star-info'>
                        {starsRathing.map((star, index) =>
                            <div className='star-info' key={index}>
                                <span className='star-number'>
                                    <Rating stars={6} value={index} cancel={false} />
                                </span>
                                <span className='star-number-info'>{star}</span>
                            </div>)}
                    </div>
                </OverlayPanel>
            </div>
        </>
    );
};

export default StarRathingInfo;