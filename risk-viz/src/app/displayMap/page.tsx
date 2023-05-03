'use client';
import MapContainer from "@/components/Map";
import React, { useState } from "react";
import 'mapbox-gl/dist/mapbox-gl.css';
import data from '@/assets/data/dataSet.json';
import "./page.css";
const DisplayPage = () : JSX.Element => {

    const [year, setYear] = useState(2030);
    const [latlong, setLatLong] = useState({ longitude: -93.756, latitude: 45.794 });

    return <>
        <div className="year-filter-container">
            <div className="year-filter-header">
                Select Year
                <span>
                    Latitude: {latlong.latitude.toFixed(3)} Longitude: {latlong.longitude.toFixed(3)}
                </span>
            </div>
            <div>
                {[2030,2040,2050,2060,2070].map( val => <button key={val} className={year === val ? "selected-year": undefined} onClick={()=>setYear(val)}>{val}</button>)}
            </div>        
        </div>
        <MapContainer callBackFuntion={setLatLong} data={data.slice(0,4000)} year={year}/>
    </>
};

export default DisplayPage;