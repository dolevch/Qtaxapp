import React from "react";
import "./StepsContainer.css";

const StepsContainer = ({ currentStep = 1, className = "" }) => {
  const steps = [
    "פרטים אישיים",
    "פרטים משפחתיים",
    "הכנסות",
    "בירורים נוספים",
    "קבצים וייפוי כוח",
  ];

  return (
    <div className={`steps-container ${className}`}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${index + 1 <= currentStep ? "active" : ""}`}>
            <div className="box">
              <div className="ellipse">{index + 1}</div>
            </div>
            <div className="step-text">{step}</div>
          </div>
          {index < steps.length - 1 && <div className="dashed-line" />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepsContainer;
