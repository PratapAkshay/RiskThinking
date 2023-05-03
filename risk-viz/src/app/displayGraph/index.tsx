import { useEffect, useMemo, useRef } from "react"
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
const DisplayGraph = ({selectedRow, year, assetName, data, businessCategory}: {selectedRow: boolean, year?: number | string, assetName: string[], businessCategory: string[], data: any[]}) => {
    
    const ref = useRef<am4charts.XYChart | null>(null);

    useEffect(() => {
        am4core.useTheme(am4themes_animated);
        if(year != 'Null'){
            createNewChart(data);
        }else{
            createChart(data);
        }

        return () => {
            if(ref.current) ref.current.dispose();
        }
    },[year, data,assetName,businessCategory]);

    const createNewChart = (filterData: any[]) => {
        if(ref.current) ref.current.dispose();
        ref.current = am4core.create("chartdiv", am4charts.XYChart);
        ref.current.data = filterData;
        ref.current.scrollbarX = new am4core.Scrollbar();
        
        // Create axes
        var categoryAxis = ref.current.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.title.text = "Number of Assets"

        var valueAxis = ref.current.yAxes.push(new am4charts.ValueAxis());
        // Create series
        var series = ref.current.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";
        if(!selectedRow)
            series.columns.template.adapter.add("fill", (fill, target) => {
                if(target.dataItem.dataContext.category === "High Risk"){
                    return '#f00'
                }else if(target.dataItem.dataContext.category === "Medium Risk"){
                    return '#ffa500'
                }
                return '#008000';
            });
        else
            series.columns.template.adapter.add("fill", (fill, target) => {
                if(target.dataItem.dataContext.value >= 0.6 ){
                    return '#f00'
                }else if(target.dataItem.dataContext.value >= 0.3){
                    return '#ffa500'
                }
                return '#008000';
            });

        var bullet = series.bullets.push(new am4charts.LabelBullet());
        bullet.label.text = "{valueY}";

        ref.current.maskBullets = false;
    }

    const createChart = (filterData: any[]) => {
        if(ref.current) ref.current.dispose();
        ref.current = am4core.create("chartdiv", am4charts.XYChart); 
        ref.current.data = filterData;
        ref.current.scrollbarX = new am4core.Scrollbar();
        const categoryAxis = ref.current.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.title.text = "Years";

        const valueAxis = ref.current.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "Risk Rating";

        var series = ref.current.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "category";

        let bullet = series.bullets.push(new am4charts.Bullet());
        let square = bullet.createChild(am4core.Circle);
        square.width = 10;
        square.height = 10;
        square.horizontalCenter = "middle";
        square.verticalCenter = "middle";
        series.tooltipText = "Year :  [bold]{categoryX}[/]\n Risk Rate: [bold]{valueY}[/]";

        ref.current.cursor = new am4charts.XYCursor();
    }

    return <div id="chartdiv"></div>
}

export default DisplayGraph;