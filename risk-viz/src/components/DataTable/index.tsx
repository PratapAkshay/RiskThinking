import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState } from 'react';
import { GridReadyEvent } from 'ag-grid-community';
import { DataTablePropsType } from './index.types';

const DataTable = ({data, columnDefs, selectedData} : DataTablePropsType) => {

    const [gridApi, setGridApi] = useState<GridReadyEvent<any, any>>();

    const onGridReady = (params: GridReadyEvent<any, any>) => {
        setGridApi(params);
    }

    return <div className="ag-theme-alpine" id="table-container">
        <AgGridReact
            columnDefs={columnDefs}
            rowData={data}
            onRowClicked={(parms) => selectedData(parms.data)}
            onGridReady={onGridReady}
            defaultColDef={{sortable: true, filter: true, floatingFilter: true}}
            pagination={true}
            paginationPageSize={10}
            suppressCellSelection={true}
            rowSelection="single"
        />
  </div>
}

export default DataTable;