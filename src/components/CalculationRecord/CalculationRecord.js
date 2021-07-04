import "./CalculationRecord.scss"

const CalculationRecord = ({ firstN, secondN, operandAsciiCode, result }) => {
  const operandString = String.fromCharCode(operandAsciiCode);

  return (
    <div className="record-container">
      {firstN} {operandString} {secondN} = {result}
    </div>
  );
};

export default CalculationRecord;
