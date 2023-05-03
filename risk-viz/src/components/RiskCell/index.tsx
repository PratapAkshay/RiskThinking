import { useId } from "react";
import "./index.css";
import { RiskCellPropsTypes } from "./index.types";

const RiskCell = (props: RiskCellPropsTypes): JSX.Element => {
    const id = useId();
    const classname = props.value >= 0.6 ? "high" : props.value >= 0.3 ? "mid" : "good"

    return <div className={"risk-cell-container " + classname} key={id}>
        {props.value ? <><span></span>{props.value}</> : "-"}
    </div>
}

export default RiskCell