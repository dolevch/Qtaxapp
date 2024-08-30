import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./Page1.css";

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const dropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const fullName = watch("fullName");

  useEffect(() => {
    const userId = location.state?.userId || id;
    if (userId) {
      setValue("id", userId);
    }
  }, [location.state, id, setValue]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
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
        return "📄";
      case "gif":
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📎";
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
        occupation: data.occupation || "", // Add this field to your form if not present
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
        navigate(`/page2/${id}`);
      } else {
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="page1">
      <div className="div">
        <div className="rectangle" />
        <p className="text-wrapper">דוח מס לשנת המס {selectedYear}</p>
        <img
          className="logo"
          alt="Qtax Logo"
          src="https://cdn.animaapp.com/projects/66af5c89776d5bcf2ecb6e2d/releases/66b3002dda47b5df7d5a9923/img/group-2@2x.png"
        />
        <div className="user-alt-light-screen" ref={dropdownRef}>
          {fullName && <div className="user-name">{fullName}</div>}
          <div className="user-icon" onClick={toggleDropdown}>
            <div className="user-circle" />
            <div className="user-body" />
          </div>
          {isDropdownOpen && (
            <div className="user-dropdown">
              <div className="dropdown-option">אזור אישי</div>
              <div className="dropdown-option">התנתק</div>
            </div>
          )}
        </div>

        <div className="steps-container">
          {[1, 2, 3, 4, 5].map((step, index) => (
            <React.Fragment key={step}>
              <div className="step">
                <div className="box">
                  <div className={`ellipse ${step === 1 ? "active" : ""}`}>
                    {step}
                  </div>
                </div>
                <div className="step-text">
                  {
                    [
                      "פרטים אישיים",
                      "פרטים משפחתיים",
                      "הכנסות",
                      "בירורים נוספים",
                      "קבצים וייפוי כוח",
                    ][index]
                  }
                </div>
              </div>
              {step < 5 && <div className="dashed-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="content-wrapper">
          <div className="text-wrapper-12">פרטים אישיים</div>
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
            שלך
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="div-wrapper" data-label="ת.ז.">
              <input
                {...register("id")}
                className="text-wrapper-id"
                placeholder="ת.ז."
                readOnly
              />
            </div>
            <div className="overlap-6" data-label="שם מלא">
              <input
                {...register("fullName", { required: true })}
                className="text-wrapper-full-name"
                placeholder="שם מלא"
              />
            </div>
            <div className="overlap-8" data-label="טלפון">
              <input
                {...register("phone", { required: true })}
                className="text-wrapper-phone"
                placeholder="טלפון"
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
              <div className="text-wrapper-21">פרטי חשבון בנק</div>
              <p className="text-wrapper-22">
                *רשות לצורך קבלת החזרים כספיים ממס הכנסה
              </p>
            </div>
            <div className="overlap-12">
              <div className="rectangle-2" />
              <input
                {...register("city", { required: true })}
                className="text-wrapper-city"
                placeholder="עיר"
              />
            </div>
            <div className="overlap-13" data-label="רחוב">
              <input
                {...register("street", { required: true })}
                className="text-wrapper-street"
                placeholder="רחוב"
              />
            </div>
            <div className="overlap-14" data-label="מספר בית / דירה">
              <input
                {...register("houseNumber", { required: true })}
                className="text-wrapper-house-number"
                placeholder="מספר בית / דירה"
              />
            </div>
            <div className="overlap-15">
              <input
                {...register("bankName")}
                className="text-wrapper-bank-name"
                placeholder="שם הבנק"
              />
            </div>

            <div className="file-upload-container">
              <label className="file-upload-label" htmlFor="file-upload">
                <span className="upload-text">לחץ כאן</span>
                <span className="upload-subtext">להעלאת צילום ת.ז (חובה)</span>
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
    </div>
  );
};

export default Page1;
