import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Logo from "./Logo";
import StepsContainer from "./StepsContainer";
import GreyBox from "./GreyBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import DropDown from "./Dropdown";
import "./Page2.css";

library.add(faUser);

const Page2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedYear = location.state?.selectedYear || new Date().getFullYear();
  const fullName = location.state?.fullName || "User"; // Default to "User" if no name is provided
  const [openDropdown, setOpenDropdown] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [maritalStatus, setMaritalStatus] = useState(""); // Moved inside the component

  const dropdownRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted. Initial marital status:", maritalStatus);
  }, []);

  useEffect(() => {
    console.log("Marital status updated:", maritalStatus);
  }, [maritalStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setOpenDropdown((prev) => !prev);
  };

  const handleChildrenCountChange = (e) => {
    setChildrenCount(Number(e.target.value));
  };

  const handleMaritalStatusChange = (e) => {
    setMaritalStatus(e.target.value);
  };

  console.log("Marital Status:", maritalStatus); // Add this line for debugging

  return (
    <div className="page2">
      <div className="page2-header">
        <GreyBox className="page2-grey-box" />
        <div className="page2-logo">
          <Logo />
        </div>
        <p className="page2-tax-year">דוח מס לשנת המס {selectedYear}</p>
      </div>
      <StepsContainer currentStep={2} className="page2-steps" />
      <div className="page2-user-icon-container" ref={dropdownRef}>
        <FontAwesomeIcon
          icon="fa-solid fa-user"
          className="page2-user-icon"
          onClick={toggleDropdown}
        />
        <span className="page2-user-name">{fullName}</span>
        {openDropdown && <DropDown />}
      </div>

      <h2 className="page2-section-title">פרטים משפחתיים</h2>
      <div className="page2-form-container">
        <h2 className="page2-main-title">מצב משפחתי</h2>
        <div className="page2-marital-status" data-label="מצב משפחתי">
          <select
            className="page2-form-select"
            onChange={handleMaritalStatusChange}
            value={maritalStatus}
          >
            onChange={handleMaritalStatusChange}
            value={maritalStatus}
            <option>בחר מצב משפחתי</option>
            <option>רווק/ה</option>
            <option>נשוי/אה</option>
            <option>גרוש/ה</option>
            <option>אלמן/ה</option>
          </select>
        </div>

        {maritalStatus === "נשוי/אה" && (
          <div className="page2-spouse-info">
            <div className="page2-spouse-name" data-label="שם בן/בת הזוג">
              <input
                type="text"
                className="page2-form-input"
                placeholder="(שם בן/בת הזוג (פרטי+משפחה"
              />
            </div>
            <div className="page2-spouse-id" data-label="ת.ז של בן/ת הזוג">
              <input
                type="number"
                className="page2-form-input"
                placeholder="ת.ז של בן/ת הזוג"
              />
            </div>
            <div
              className="page2-spouse-birthdate"
              data-label="תאריך לידה של בן/ת הזוג"
            >
              <input
                type="date"
                className="page2-form-input page2-date-input"
                placeholder="תאריך לידה של בן/ת הזוג"
              />
            </div>
          </div>
        )}
        <div className="page2-children-container debug-children-select">
          <h2 className="page2-children-title">מספר ילדים</h2>
          <div className="page2-children-count">
            <select
              className="page2-form-select page2-children-select debug-select"
              onChange={handleChildrenCountChange}
              value={childrenCount}
            >
              <option value={0}>בחר מספר ילדים</option>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        {[...Array(childrenCount)].map((_, index) => (
          <div
            key={index}
            className={`page2-child-${index + 1}`}
            data-label={`ילד ${index + 1}`}
          >
            <input
              type="date"
              className="page2-form-input page2-date-input"
              placeholder={`תאריך לידה של הילד ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <footer className="page2-footer">
        <button
          className="page2-button page2-button-secondary"
          onClick={() => navigate(`/page1/${id}`)}
        >
          חזור
        </button>
        <button
          className="page2-button page2-button-primary"
          onClick={() => {
            /* Handle next */
          }}
        >
          המשך
        </button>
      </footer>
    </div>
  );
};

export default Page2;
