import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import "./Page1.css";
import GreyBox from "./GreyBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
library.add(faUser);
import DropDown from "./Dropdown.jsx";
import StepsContainer from "./StepsContainer.jsx";
import Upload from "./Upload.jsx";

export const Page1 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [openDropdown, setOpenDropdown] = useState(false);

  const [selectedYear, setSelectedYear] = useState(2024);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedBankFile, setUploadedBankFile] = useState(null);
  const dropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const fullName = watch("fullName");

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

  useEffect(() => {
    const userId = location.state?.userId || id;
    if (userId) {
      setValue("id", userId);
    }
  }, [location.state, id, setValue]);

  const toggleYearDropdown = () => setIsYearDropdownOpen(!isYearDropdownOpen);
  const selectYear = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleFileDelete = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            width="24"
            height="24"
          >
            <path
              d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"
              fill="#ff0000"
            />
          </svg>
        );
      case "gif":
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="24"
            height="24"
          >
            <path
              d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
              fill="#00ff00"
            />
          </svg>
        );
      default:
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          width="24"
          height="24"
        >
          <path
            d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128z"
            fill="#0000ff"
          />
        </svg>;
    }
  };

  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    try {
      const formData = {
        fullName: data.fullName,
        phoneNumber: data.phone,
        address: `${data.street}, ${data.houseNumber}, ${data.city}`,
        dateOfBirth: data.birthDate,
        occupation: data.occupation || "",
      };

      console.log("Sending data:", formData);

      const response = await fetch(`/api/users/${id}/additional-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submission successful, navigating to Page2");

        navigate(`/page2/${id}`, {
          state: { selectedYear, fullName: data.fullName },
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="page1">
      <GreyBox />
      <Logo />
      <StepsContainer currentStep={1} className="page1-steps" />
      <div className="user-icon-container" ref={dropdownRef}>
        <FontAwesomeIcon
          icon="fa-solid fa-user"
          className="user-icon"
          onClick={toggleDropdown}
        />
        {openDropdown && <DropDown />}
      </div>
      <div className="div">
        <p className="text-wrapper">דוח מס לשנת המס {selectedYear}</p>
        <div className="user-alt-light-screen" ref={dropdownRef}>
          <input
            value={fullName}
            onChange={(e) => setValue("fullName", e.target.value)}
          />
        </div>
        <div className="text-wrapper-13" ref={yearDropdownRef}>
          <span>דוח עבור שנת המס</span>
          <div className="year-selector">
            <span>{selectedYear}</span>
            <div className="year-dropdown-icon" onClick={toggleYearDropdown}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>
          {isYearDropdownOpen && (
            <div className="year-dropdown">
              {[2024, 2023, 2022, 2021, 2020, 2019].map((year) => (
                <div
                  key={year}
                  className="year-option"
                  onClick={() => selectYear(year)}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="service-cost-text">
          השירות הינו בעלות של 800 שקלים. החיוב יבוצע במועד העבודה על דוח המס
          שלך.
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="div-wrapper" data-label="ת.ז.">
            <input {...register("id")} className="text-wrapper-id" readOnly />
          </div>
          <div className="overlap-6" data-label="שם מלא">
            <input
              {...register("fullName", { required: true })}
              className="text-wrapper-full-name"
            />
          </div>
          <div className="overlap-8" data-label="טלפון">
            <input
              {...register("phone", { required: true })}
              className="text-wrapper-phone"
            />
          </div>
          <p className="text-wrapper-18">
            *כדי שנוכל לחזור אליך במידה ויש בעיה בטופס
          </p>
          <div className="overlap-10" data-label="תאריך לידה">
            <input
              {...register("birthDate", { required: true })}
              type="date"
              className="text-wrapper-birth-date"
            />
          </div>
          <div className="text-wrapper-20">כתובת מגורים</div>
          <div className="overlap-11">
            <p className="text-wrapper-22">
              *רשות לצורך קבלת החזרים כספיים ממס הכנסה
            </p>
          </div>
          <div className="overlap-12" data-label="עיר">
            <input
              {...register("city", { required: true })}
              className="text-wrapper-city"
            />
          </div>
          <div className="overlap-13" data-label="רחוב">
            <input
              {...register("street", { required: true })}
              className="text-wrapper-street"
            />
          </div>
          <div className="overlap-14" data-label="מספר בית / דירה">
            <input
              {...register("houseNumber", { required: true })}
              className="text-wrapper-house-number"
            />
          </div>

          <div className="file-upload-container">
            <label className="file-upload-label" htmlFor="file-upload">
              <span className="upload-text">לחץ כאן</span>
              <span className="upload-subtext">להעלאת צילום ת.ז (עם הספח)</span>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.gif,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            {uploadedFile && (
              <div className="uploaded-file-icon">
                <span className="file-icon">
                  {getFileIcon(uploadedFile.name)}
                </span>
                <span className="file-name">{uploadedFile.name}</span>
                <span className="file-delete" onClick={handleFileDelete}>
                  ✕
                </span>
              </div>
            )}
          </div>

          {/* New Upload component added here */}
          <div className="new-upload-container">
            <h4>העלאת אישור ניהול חשבון בנק</h4>
            <Upload
              onUpload={(files) => {
                if (files && files.length > 0) {
                  setUploadedBankFile(files[0]);
                }
              }}
              maxSize={5242880}
              multiple={false}
              acceptedFileTypes={{
                "image/*": [".jpeg", ".jpg", ".png", ".gif"],
                "application/pdf": [".pdf"],
              }}
              customStyles={{
                border: "1px dashed #cccccc",
                borderRadius: "4px",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "14px",
                width: "200px",
                margin: "10px auto",
              }}
            />
            {uploadedBankFile && (
              <div className="uploaded-file-icon">
                <span className="file-icon">
                  {getFileIcon(uploadedBankFile.name)}
                </span>
                <span className="file-name">{uploadedBankFile.name}</span>
                <span
                  className="file-delete"
                  onClick={() => setUploadedBankFile(null)}
                >
                  ✕
                </span>
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="overlap-18">
        <button
          type="button"
          className="text-wrapper-26"
          onClick={handleSubmit(onSubmit)}
        >
          המשך
        </button>
      </div>
      <div className="overlap-19">
        <button
          type="button"
          className="text-wrapper-27"
          onClick={() => navigate(-1)}
        >
          חזור
        </button>
      </div>
    </div>
  );
};

export default Page1;
