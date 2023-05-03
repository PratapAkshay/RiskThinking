import { ColDef, ColGroupDef } from "ag-grid-community";

export interface DataTablePropsType{
    data: any[],
    columnDefs: (ColDef<any> | ColGroupDef<any>)[] | null,
    selectedData: (data: {[keys: string]: any}) => void
}