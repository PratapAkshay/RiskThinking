'use client'
import React, {useEffect, useMemo } from 'react';
import { useState } from 'react';
import Map, { MapRef } from 'react-map-gl';
import { Tprops } from './map.types';
import * as Supercluster from 'supercluster';
import "./map.styles.css";
import { BBox, GeoJsonProperties } from 'geojson';
import useSupercluster from './useSuperCluster';
import ClusterMarker from '../ClusterMarker';
import PointMarker from '../PointMarker';

const MapContainer = (props: React.PropsWithChildren<Tprops> ) : JSX.Element => {

    const [viewport, setViewPost] = useState({
        longitude: -93.756, 
        latitude: 45.794,
        zoom: 3.4972565142111356
      });
    const [bounds, setBonds] = useState<BBox | undefined>([
        -121.02866242941192,
        29.70403327714881,
        -66.48333757059049,
        58.29353768517453
    ]);

    const mapRef = React.useRef<MapRef>(null);

    const cluterPoints : Array<Supercluster.PointFeature<GeoJsonProperties>> = useMemo( () => {
        return props.data.map( cluster => {
            return {
                type: "Feature",
                properties: {
                    cluster: false,
                    category: cluster['Business Category'],
                    details: {...cluster}
                },
                geometry: { type: "Point", coordinates: [cluster.Long, cluster.Lat] }
            }
        });
    },[props.data]);;

    useEffect(() => {
        setBonds(mapRef.current?.getBounds().toArray().flat() as BBox);
        props.callBackFuntion({
            latitude: viewport.latitude, 
            longitude: viewport.longitude
        });
    },[viewport])

    const { clusters, supercluster } = useSupercluster({
        points: cluterPoints,
        bounds : bounds,
        zoom: viewport.zoom,
        options: { radius: 75, maxZoom: 20 }
    });

    const onClickClusterMarker = (clusterID:  number = 0, longitude: number, latitude: number) => {
        if(supercluster){
            const expenssionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterID), 20);
            mapRef.current?.easeTo({
                center: [longitude, latitude],
                zoom: expenssionZoom,
                duration: 500
            })
        }
    }

    return <Map
        {...viewport}
        ref={mapRef}
        maxZoom={20}
        style={{ width: "100%", height: "100%" }}
        onMove={(e) => {setViewPost(e.viewState)}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAP_TOKEN}
    >
        {clusters.map( (cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
                cluster : isCluster,
                point_count : pointCount
            } = cluster.properties;

            return isCluster ?
            <ClusterMarker pointsLength={cluterPoints.length} onClick={() => onClickClusterMarker(Number(cluster.id),longitude, latitude)} latitude={latitude} longitude={longitude} markerCount={pointCount} /> :
            <PointMarker latitude={latitude} longitude={longitude} severity={cluster.properties ? cluster.properties.details['Risk Rating'] : 0} />
        })}
    </Map>
}

export default MapContainer;