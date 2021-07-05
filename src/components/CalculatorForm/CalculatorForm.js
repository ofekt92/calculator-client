import { useState, useEffect } from "react";

import "./CalculatorForm.scss";

/**
 * Handles the form and its inputs.
 */
const CalculatorForm = ({ operands, onFormSubmit, calcResult, updateValues }) => {
  const [firstNumber, setFirstNumber] = useState("");
  const [secondNumber, setSecondNumber] = useState("");
  const [selectedOperand, setSelectedOperand] = useState("");

  /**
   * If the form needs to render the values from the history list, it will be rendered with updatevalues in its props.
   */
  useEffect(() => {
    if (updateValues && Object.values(updateValues).length > 0) {
      setFirstNumber(updateValues.firstN);
      setSecondNumber(updateValues.secondN);
      setSelectedOperand(updateValues.operationAsciiCode);
    }
  }, [updateValues]);

  /**
   * Defaults the operand to '+'.
   */
  useEffect(() => {
    if (operands.length) {
      setSelectedOperand(operands[0]);
    }
  }, [operands]);

  let operandOptions = null;
  if (operands.length > 0) {
    operandOptions = operands.map((op, index) => {
      const operandSymbol = String.fromCharCode(op);
      return (
        <option key={index} value={op}>
          {operandSymbol}
        </option>
      );
    });
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const inputs = {
      firstN: firstNumber,
      secondN: secondNumber,
      operand: selectedOperand,
    };
    onFormSubmit(inputs);
  };

  /**
   * Update the form's state (for two way binding).
   * @param {Event} event 
   */
  const onInputChangedHandler = (event) => {
    if (event.target.value != null) {
      switch (event.target.id) {
        case "firstN":
          setFirstNumber(event.target.value);
          break;
        case "secondN":
          setSecondNumber(event.target.value);
          break;
        case "operands":
          setSelectedOperand(event.target.value);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="form__container">
      <form onSubmit={onSubmitHandler}>
        <input
          className="input-number"
          type="number"
          id="firstN"
          required
          onChange={onInputChangedHandler}
          value={firstNumber}
        />
        <select id="operands" onChange={onInputChangedHandler} value={selectedOperand}>
          {operandOptions || <option>Please Wait</option>}
        </select>
        <input
          className="input-number"
          type="number"
          id="secondN"
          required
          onChange={onInputChangedHandler}
          value={secondNumber}
        />
        <div className="submit-button-container">
          <input type="submit" value="Calculate" />
        </div>
        <div className="result-line"></div>
        <div className="result-area" style={{ color: isNaN(+calcResult) ? "red" : "black" }}>
          {calcResult}
        </div>
      </form>
    </div>
  );
};

export default CalculatorForm;
