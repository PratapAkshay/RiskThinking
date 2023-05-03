'use client';
import { Inter } from 'next/font/google'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo, useState } from 'react';
import DisplayGraph from './displayGraph';
import data from "../assets/data/dataSet.json";
import DataTable from '@/components/DataTable';
import MapContainer from '@/components/Map';
import RiskCell from '@/components/RiskCell';
const inter = Inter({ subsets: ['latin'] }) 
export default function Home() : JSX.Element {
  const [detailedData,setDetailedData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [JsonData, setJsonData] = useState(data.sort((a,b) => a['Year'] - b["Year"]))
  const [year, setYear] = useState<number | string>(2030);
  const [selectedRow, setSelectedRow] = useState<{[key: string]: any} | null>(null);
  const [latlong, setLatLong] = useState({ longitude: -93.756, latitude: 45.794 });
  const [distinctRiskFactor, setDistinctRiskFactor] = useState<string[]>([]);
  const [distinctAssetName, setDistinctAssetName] = useState<string[]>([]);
  const [distinctBusinessCategory, setDistinctBusinessCategory] = useState<string[]>([]);
  const [selectedAssetName, setSelectedAssetName] = useState<string[]>([distinctAssetName[0]]);
  const [selectedBusinessCategory, setBusinessCategory] = useState([distinctBusinessCategory[0]]);
  
  const [columnDefs, setColumnDefs] = useState([
    {headerName: "Asset Name", field: "Asset Name"},
    {headerName: "Risk Rating", field: "Risk Rating", cellRendererFramework:(parms) => <RiskCell value={parms.value}/>},
    {headerName: "Latttude", field: "Lat", filter: false},
    {headerName: "Longitude", field: "Long", filter: false},
    {headerName: "Business Category", field: "Business Category"},
    {headerName: "Year", field: "Year"},
  ]);

  const commonStateChangeHandler = () => {
    let RiskFactor: {[key: string]: any} = {};
    let AssetName: {[key: string]: any} = {};
    let BusinessCategory: {[key: string]: any} = {};
    let columnSeriesdData: {[key: string]: any} = {'High Risk': 0, 'Medium Risk': 0, 'No Risk': 0};
    let lineSeriesData: {[key: string]: any} = {2030 : {risk: 0, count:0 },2040: {risk: 0, count:0 },2050: {risk: 0, count:0 },2060: {risk: 0, count:0 },2070: {risk: 0, count:0 }}
    setDetailedData(JsonData.filter( val => year === 'Null' ? true : val.Year === year).map( val => {
      if(year === 'Null'){
        lineSeriesData[val.Year].risk += val['Risk Rating'];
        lineSeriesData[val.Year].count += 1;
      }else{
        columnSeriesdData[val['Risk Rating'] >= 0.6 ? 'High Risk' : val['Risk Rating'] >= 0.3 ? 'Medium Risk': 'No Risk'] += 1;
      }
      let risk = JSON.parse(val['Risk Factors'])
      RiskFactor = {...RiskFactor,...risk};
      AssetName[val['Asset Name']] = null;
      BusinessCategory[val['Business Category']] = null;
      return {...val,...risk};
    }));
    let chartData = year === 'Null' ? lineSeriesData : columnSeriesdData;
    setChartData(Object.keys(chartData).map( val => {
      return {
        category: val,
        value: year === 'Null' ? (chartData[val].risk / chartData[val].count) : chartData[val]
      }
    }))
    setDistinctRiskFactor(Object.keys(RiskFactor));
    setDistinctAssetName(Object.keys(AssetName));
    setDistinctBusinessCategory(Object.keys(BusinessCategory));
    setSelectedAssetName([Object.keys(AssetName)[0]]);
    setBusinessCategory([Object.keys(BusinessCategory)[0]]);
    return [RiskFactor,AssetName,BusinessCategory];
  }

  useEffect(() => {
    if(selectedRow){
      let obj: any[] = [];
      distinctRiskFactor.forEach( val => {
        if(selectedRow[val]){
          obj.push({
            category: val,
            value: selectedRow[val]
          })
        }
      });
      setChartData(obj);
    }
  },[selectedRow]);

  useEffect(() => {
    let [RiskFactor] = commonStateChangeHandler();
    setColumnDefs( prev => {
      let update = Object.keys(RiskFactor).map( risk => ({headerName: risk, field: risk, cellRendererFramework:(parms) => <RiskCell value={parms.value}/>}));
      return [ ...prev,...update];
    })
  },[]);

  useEffect(() => {
    setSelectedRow(null);
    if(detailedData.length){
      commonStateChangeHandler();
    }
  },[year]);

  return (
    <div className='page-container'>
      <div className="year-filter-container">
        <div>
          {[2030,2040,2050,2060,2070,'Null'].map( val => <button key={val} className={year === val ? "selected-year": undefined} onClick={()=> {setYear(val)} }>{val}</button>)}
        </div>        
      </div>
      <DisplayGraph selectedRow={selectedRow !== null} year={year} data={chartData} assetName={selectedAssetName} businessCategory={selectedBusinessCategory}/>
      <DataTable selectedData={(data) => setSelectedRow(data)} data={detailedData} columnDefs={columnDefs}/>
      <div id="graph-container">
        <MapContainer callBackFuntion={setLatLong} data={detailedData} year={year}/>
      </div>
    </div>
  )
}
