export interface Tprops{
    data: any[];
    year?: number | string;
    callBackFuntion: React.Dispatch<React.SetStateAction<{
        longitude: number;
        latitude: number;
    }>>;
}