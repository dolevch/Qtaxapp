import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  const [selfEmployed, setSelfEmployed] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSelfEmployedClick = (value) => {
    setSelfEmployed(value);
    if (value) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  return (
    <div className="welcome-page">
      <div className="div-6">
        <div className="overlap-23">
          <div className="text-wrapper-36">ברוכים הבאים לQtax</div>
          <p className="text-wrapper-37">
            Qtax מאפשר לכם להעביר דוח שנתי למס הכנסה בצורה חדשנית, מהירה וזולה.
          </p>
        </div>
        <div className="overlap-24">
          <p className="text-wrapper-38">
            כדי לדעת אם Qtax מתאים לכם, לפני שמתחילים, נשמח לברר מספר פרטים:
          </p>
          <p className="text-wrapper-39">האם את/ה או בן/בת הזוג עצמאים?</p>
          <div className="options-container">
            <div
              className="option"
              onClick={() => handleSelfEmployedClick(true)}
            >
              <span className="option-text">כן</span>
              <div
                className="ellipse"
                style={{
                  backgroundColor:
                    selfEmployed === true ? "#0061e5" : "transparent",
                }}
              />
            </div>
            <div
              className="option"
              onClick={() => handleSelfEmployedClick(false)}
            >
              <span className="option-text">לא</span>
              <div
                className="ellipse"
                style={{
                  backgroundColor:
                    selfEmployed === false ? "#0061e5" : "transparent",
                }}
              />
            </div>
          </div>
        </div>
        <div className="overlap-group-4">
          <p className="div-7">
            <span className="text-wrapper-45">כבר רשומים? היכנסו </span>
            <span className="text-wrapper-46">לאיזור האישי</span>
          </p>
          {selfEmployed === false && (
            <Link to="http://localhost:5173/signup">
              <div className="rectangle-10">
                <span className="registration-text">הרשמה</span>
              </div>
            </Link>
          )}
        </div>
        {showPopup && (
          <div className="popup">
            אנחנו עדין לא תומכים בעצמאיים, לפרטים נוספים ניתן לפנות ל
            054-6658608
          </div>
        )}
        <div className="group-wrapper">
          <img
            className="group-3"
            alt="Group"
            src="https://cdn.animaapp.com/projects/66af5c89776d5bcf2ecb6e2d/releases/66b3002dda47b5df7d5a9923/img/group-2@2x.png"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
