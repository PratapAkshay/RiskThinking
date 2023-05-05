import { Marker } from "react-map-gl"
import { ClusterMarkerPropsType } from "./index.types"
import { useId } from "react"
import "./index.css";

const ClusterMarker = ({pointsLength, markerCount, latitude, longitude, onClick} : ClusterMarkerPropsType) => {
    
    const markerId = useId();

    return <Marker
        onClick={onClick}
        key={markerId}
        latitude={latitude}
        longitude={longitude}
    >
        <div 
            className="cluster-marker tooltip" 
            style={{
                width: `${30 + (markerCount / pointsLength) * 20}px`,
                height: `${30 + (markerCount / pointsLength) * 20}px`
            }}
        >
            {markerCount}
            <div className="tooltiptext">
                Marker Count is {markerCount}
            </div>
        </div>
    </Marker>
}

export default ClusterMarker;