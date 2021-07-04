import { useState, useEffect } from "react";

import CalculatorForm from "../CalculatorForm/CalculatorForm";
import History from "../History/History";
import axios from "../../axios-calc";

import Modal from "@material-ui/core/Modal";

import "./Calculator.scss";

/**This component handles all the HTTP requests and sends the results down to its child components */
const Calculator = () => {
  const [operands, setOperands] = useState([]);
  const [history, setHistory] = useState([]);
  const [calcResult, setCalcResults] = useState("0.0");
  const [updateValues, setUpdateValues] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * On load of page, get the available operands and the current calculation history.
   * */
  useEffect(() => {
    const getFromApi = async (url) => {
      const response = await axios.get(url);
      return response.status === 200 && response.data;
    };
    Promise.all([getFromApi("/operations"), getFromApi("/history")])
      .then((response) => {
        setOperands(response[0]);
        setHistory(response[1]);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setCalcResults(null);
        setError(`${err.message}: The server seems to be offline.`);
      });
  }, []);

  /** Submits the calculation request to the server and sets the result in state as well as adding the new history record to the state. */
  const onCalcFormSubmit = async ({ firstN, secondN, operand }) => {
    if (updateValues) {
      postUpdateRequest(firstN, secondN, operand);
    } else {
      postNewCalculationRequest(firstN, secondN, operand);
    }
  };

  /**Posts a new calculation request to the server.
   * Upon receiving the result, update the state so we can send it to the form and history.
   */
  const postNewCalculationRequest = async (firstN, secondN, operand) => {
    const requestObject = {
      firstNum: +firstN,
      secondNum: +secondN,
      OperandAsciiCode: +operand,
    };
    const calcResponse = await postCalculation("/calculator", requestObject);
    if (calcResponse?.isSuccess) {
      const newHistoryRecordList = [...history, calcResponse.newCalculationRecord];

      setCalcResults(calcResponse.newCalculationRecord?.result.toFixed(1));
      setHistory(newHistoryRecordList);
    } else {
      setCalcResults(null);
      setError(calcResponse);
    }
  };

  /**
   * Sends an http POST request to update an existing calculation.
   */
  const postUpdateRequest = async (firstN, secondN, operand) => {
    const requestObject = {
      firstNum: +firstN,
      secondNum: +secondN,
      OperandAsciiCode: +operand,
      recordId: updateValues.id,
    };

    const updateResponse = await postCalculation("/history/update", requestObject);
    if (updateResponse?.isSuccess) {
      const updatedHistory = history.map((rec) => {
        if (rec.id === updateValues.id) {
          return {
            ...rec,
            firstN,
            secondN,
            result: updateResponse.updatedResult,
            operationAsciiCode: +operand,
          };
        } else {
          return rec;
        }
      });
      setHistory(updatedHistory);
      setUpdateValues(null);
      setCalcResults(updateResponse.updatedResult.toFixed(1));
    } else {
      setError(updateResponse);
      setCalcResults(null);
    }
  };

  const postCalculation = async (url, request) => {
    let result;
    try {
      const response = await axios.post(url, request);
      if (response.status === 200) {
        if (response.data?.isSuccess) {
          result = response.data;
        } else {
          result = response.data?.errorMessage;
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        result = "Numbers must be valid integers. Please try again with different values.";
      }
    }
    return result;
  };

  /** Checks if the deleted value is not the one to be updated, and if not - sends an HTTP Delete request to the server. */
  const onDeleteClickedHandler = async (recordId) => {
    try {
      if (updateValues?.id === recordId) {
        setUpdateValues(null);
      }
      const newRecordsResponse = await axios.delete(`/history/delete?id=${recordId}`);
      if (newRecordsResponse?.data?.isSuccess) {
        const newRecordsList = history.filter((rec) => rec.id !== recordId);
        setHistory(newRecordsList);
      }
    } catch (error) {
      setError(error);
    }
  };

  /**Sets the values to be updated in the state, so upon submitting again we can send to the API */
  const onUpdateClickedHandler = (recordId) => {
    const recordToUpdate = history.find((rec) => rec.id === recordId);
    if (recordToUpdate) {
      setUpdateValues(recordToUpdate);
      setCalcResults(recordToUpdate.result.toFixed(1));
    }
  };

  return (
    <div className="calculator-container">
      <h3>Calculator</h3>
      <CalculatorForm
        operands={operands}
        onFormSubmit={onCalcFormSubmit}
        calcResult={calcResult || error}
        updateValues={updateValues}
      />
      <History records={history} deleteHandler={onDeleteClickedHandler} updateHandler={onUpdateClickedHandler} />
      <Modal open={isLoading} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
        {/* {I had to use inline style here because material-UI Modal was interferring with my CSS} */}
        <div
          style={{ margin: "15% auto", backgroundColor: "white", width: "16%", height: "13%", textAlign: "center" }}
          className="loading-modal"
        >
          <h3>Loading</h3>
          <p>Loading history records and available actions, please wait...</p>
        </div>
      </Modal>
    </div>
  );
};

export default Calculator;
