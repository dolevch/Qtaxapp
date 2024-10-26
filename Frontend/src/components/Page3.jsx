import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Page3.css";

import StepsContainer from "./StepsContainer";
import Logo from "./Logo";

const Page3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { textWrapperContent, userFullName, selectedYear } =
    location.state || {};

  const [workIncome, setWorkIncome] = useState("");
  const [hasInvestmentAccount, setHasInvestmentAccount] = useState(null);
  const [investmentAccountType, setInvestmentAccountType] = useState("");
  const [hasRealEstateIncome, setHasRealEstateIncome] = useState(null);
  const [paysAdvancePayments, setPaysAdvancePayments] = useState(null);
  const [monthlyRentIncome, setMonthlyRentIncome] = useState({});
  const [otherIncome, setOtherIncome] = useState("");
  const [form106File, setForm106File] = useState(null);
  const [form867File, setForm867File] = useState(null);

  useEffect(() => {
    console.log("Received state:", location.state);
  }, [location.state]);

  const handleFileUpload = (e, setFile) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleContinue = () => {
    console.log("Income data:", {
      workIncome,
      hasInvestmentAccount,
      investmentAccountType,
      hasRealEstateIncome,
      paysAdvancePayments,
      monthlyRentIncome,
      otherIncome,
      form106File: form106File ? form106File.name : null,
      form867File: form867File ? form867File.name : null,
    });
    navigate("/admin");
  };

  const handleBack = () => {
    navigate(`/page2/${id}`, {
      state: { textWrapperContent, userFullName, selectedYear },
    });
  };

  return (
    <div className="page3">
      <div className="content">
        <div className="header">
          <Logo />
          <p className="text-wrapper">
            {textWrapperContent ||
              `דוח מס לשנת המס ${selectedYear || new Date().getFullYear()}`}
          </p>
          <UserIcon userName={userFullName} />
        </div>

        <StepsContainer currentStep={3} />

        <div className="income-section">
          <h2 className="section-title">הכנסות מעבודה</h2>
          <div className="form-group">
            <label htmlFor="workIncome">הכנסה שנתית מעבודה:</label>
            <input
              type="number"
              id="workIncome"
              value={workIncome}
              onChange={(e) => setWorkIncome(e.target.value)}
              placeholder="הזן את ההכנסה השנתית מעבודה"
            />
          </div>
          <div className="file-upload">
            <label htmlFor="form106">לחצו וצרפו טופס 106 מהמעסיק</label>
            <input
              type="file"
              id="form106"
              onChange={(e) => handleFileUpload(e, setForm106File)}
            />
            {form106File && <p>File selected: {form106File.name}</p>}
          </div>
        </div>

        <div className="investment-section">
          <h2 className="section-title">הכנסות מהשקעות</h2>
          <p>האם הנך בעל חשבון השקעות?</p>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="yes"
                checked={hasInvestmentAccount === true}
                onChange={() => setHasInvestmentAccount(true)}
              />
              כן
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={hasInvestmentAccount === false}
                onChange={() => setHasInvestmentAccount(false)}
              />
              לא
            </label>
          </div>
          {hasInvestmentAccount && (
            <div className="investment-type">
              <label>
                <input
                  type="radio"
                  value="single"
                  checked={investmentAccountType === "single"}
                  onChange={() => setInvestmentAccountType("single")}
                />
                חשבון בודד
              </label>
              <label>
                <input
                  type="radio"
                  value="multiple"
                  checked={investmentAccountType === "multiple"}
                  onChange={() => setInvestmentAccountType("multiple")}
                />
                מספר חשבונות השקעה נפרדים
              </label>
            </div>
          )}
          <div className="file-upload">
            <label htmlFor="form867">לחצו וצרפו טופס 867</label>
            <input
              type="file"
              id="form867"
              onChange={(e) => handleFileUpload(e, setForm867File)}
            />
            {form867File && <p>File selected: {form867File.name}</p>}
          </div>
        </div>

        <div className="real-estate-section">
          <h2 className="section-title">הכנסות מנדל"ן למגורים</h2>
          <p>האם ברשותך הכנסות מנדל"ן למגורים?</p>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="yes"
                checked={hasRealEstateIncome === true}
                onChange={() => setHasRealEstateIncome(true)}
              />
              כן
            </label>
            <label>
              <input
                type="radio"
                value="no"
                checked={hasRealEstateIncome === false}
                onChange={() => setHasRealEstateIncome(false)}
              />
              לא
            </label>
          </div>
          {hasRealEstateIncome && (
            <>
              <p>האם את/ה משלם/ת מקדמות בגין ההכנסות משכ"ד?</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="yes"
                    checked={paysAdvancePayments === true}
                    onChange={() => setPaysAdvancePayments(true)}
                  />
                  כן
                </label>
                <label>
                  <input
                    type="radio"
                    value="no"
                    checked={paysAdvancePayments === false}
                    onChange={() => setPaysAdvancePayments(false)}
                  />
                  לא
                </label>
              </div>
              <p>אנא ציינ/י הכנסות משכ"ד לפי חודשים</p>
              {[
                "ינואר",
                "פברואר",
                "מרץ",
                "אפריל",
                "מאי",
                "יוני",
                "יולי",
                "אוגוסט",
                "ספטמבר",
                "אוקטובר",
                "נובמבר",
                "דצמבר",
              ].map((month) => (
                <div key={month} className="month-income">
                  <label htmlFor={month}>{month}</label>
                  <input
                    type="number"
                    id={month}
                    value={monthlyRentIncome[month] || ""}
                    onChange={(e) =>
                      setMonthlyRentIncome({
                        ...monthlyRentIncome,
                        [month]: e.target.value,
                      })
                    }
                    placeholder="הכנסה"
                  />
                </div>
              ))}
            </>
          )}
        </div>

        <div className="other-income-section">
          <h2 className="section-title">הכנסות נוספות</h2>
          <textarea
            value={otherIncome}
            onChange={(e) => setOtherIncome(e.target.value)}
            placeholder="פרטו הכנסות אחרות"
          />
        </div>

        <div className="button-container">
          <button className="back-button" onClick={handleBack}>
            חזור
          </button>
          <button className="continue-button" onClick={handleContinue}>
            המשך
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page3;
