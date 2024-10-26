import React from "react";
import "./NavigationButtons.css";

const NavigationButtons = ({ onBack, onForward }) => {
  return (
    <div className="navigation-buttons">
      <div className="back-button">
        <button type="button" className="text-wrapper-27" onClick={onBack}>
          חזור
        </button>
      </div>
      <div className="forward-button">
        <button type="button" className="text-wrapper-26" onClick={onForward}>
          המשך
        </button>
      </div>
    </div>
  );
};

export default NavigationButtons;
