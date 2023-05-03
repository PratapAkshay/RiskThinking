import { useId } from "react"
import { PointMarkerPropsType } from "./index.types";
import { Marker } from "react-map-gl";
import Image from 'next/image';
import good from "../../assets/images/good.png";
import high from "../../assets/images/high.png";
import mid from "../../assets/images/mid.png";


const PointMarker = ({latitude, longitude, severity}: PointMarkerPropsType) => {

    const markerId = useId();

    const selectedIcon = () => {
        if(severity >= 0.6)
            return high;
            else if(severity >= 0.3)
                return mid;

        return good;
    }

    return <Marker
        key={markerId}
        latitude={latitude}
        longitude={longitude}
    >
        <Image width={40} height={40} src={good} alt={''}/>
    </Marker>
}

export default PointMarker;