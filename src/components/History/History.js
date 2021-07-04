import CalculationRecord from "../CalculationRecord/CalculationRecord";
import Button from "../UI/Button/Button";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

import "./History.scss";

const History = ({ records, deleteHandler, updateHandler }) => {
  const calcRecords = records?.map((rec, index) => {
    return (
      <li key={index}>
        <CalculationRecord
          firstN={rec.firstN}
          secondN={rec.secondN}
          operandAsciiCode={rec.operationAsciiCode}
          result={rec.result}
        />
        <span>
          <Button className="record-list-item__button" command={() => deleteHandler(rec.id)}>
            <HighlightOffRoundedIcon />
          </Button>
          <Button className="record-list-item__button" command={() => updateHandler(rec.id)}>
            <ArrowForwardIcon />
          </Button>
        </span>
      </li>
    );
  });

  return (
    <div className="record-list__container">
      <h4>History</h4>
      {calcRecords?.length > 0 
      ? <ul className="record-list__list">{calcRecords}</ul>
      : <div className="record-list__empty-msg">Calculation history is empty.</div>}
    </div>
  );
};

export default History;
