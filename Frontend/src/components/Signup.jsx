import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const REDIRECT_URL = "/welcome"; // Update this with the correct route when determined

const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "all",
  });

  const [inputFocus, setInputFocus] = useState({
    email: false,
    id: false,
    password: false,
    confirmPassword: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Sending signup request:", data);
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          id: data.id,
          password: data.password,
        }),
      });
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const responseText = await response.text();
      console.log("Response text:", responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Invalid response format");
      }

      console.log("Parsed response data:", responseData);

      if (response.ok) {
        alert("Registration successful!");
        navigate(REDIRECT_URL);
      } else {
        alert(
          `Registration failed: ${responseData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert(`An error occurred: ${error.message}. Please try again later.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="SIGNUP">
      <div className="div-2">
        <div className="text-wrapper">ברוכים הבאים לQtax</div>
        <p className="qtax">
          נמצאתם מתאים לQtax. <br />
          הכניסו מייל וסיסמא ובואו נתחיל!
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={`overlap-2 ${
              inputFocus.email || watch("email") ? "focused" : ""
            }`}
          >
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email format",
                },
              })}
              onFocus={() => setInputFocus({ ...inputFocus, email: true })}
              onBlur={() => setInputFocus({ ...inputFocus, email: false })}
              className="input-field"
            />
            <label>מייל</label>
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>
          <div
            className={`overlap-3 ${
              inputFocus.id || watch("id") ? "focused" : ""
            }`}
          >
            <input
              {...register("id", {
                required: "ID is required",
                pattern: {
                  value: /^\d{9}$/,
                  message: "ID must be 9 digits",
                },
              })}
              onFocus={() => setInputFocus({ ...inputFocus, id: true })}
              onBlur={() => setInputFocus({ ...inputFocus, id: false })}
              className="input-field"
            />
            <label>מספר זהות</label>
            {errors.id && (
              <span className="error-message">{errors.id.message}</span>
            )}
          </div>
          <div
            className={`overlap-4 ${
              inputFocus.password || watch("password") ? "focused" : ""
            }`}
          >
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              onFocus={() => setInputFocus({ ...inputFocus, password: true })}
              onBlur={() => setInputFocus({ ...inputFocus, password: false })}
              className="input-field"
            />
            <label>סיסמא</label>
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>
          <div
            className={`overlap-5 ${
              inputFocus.confirmPassword || watch("confirmPassword")
                ? "focused"
                : ""
            }`}
          >
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              onFocus={() =>
                setInputFocus({ ...inputFocus, confirmPassword: true })
              }
              onBlur={() =>
                setInputFocus({ ...inputFocus, confirmPassword: false })
              }
              className="input-field"
            />
            <label>אימות סיסמא</label>
            {errors.confirmPassword && (
              <span className="error-message">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <div className="checkbox-container terms-checkbox">
            <input
              type="checkbox"
              {...register("termsAccepted", {
                required: "You must accept the terms of use",
              })}
              id="termsAccepted"
            />
            <label htmlFor="termsAccepted">
              אני מאשר שקראתי את תנאי השימוש
            </label>
            {errors.termsAccepted && (
              <span className="error-message">
                {errors.termsAccepted.message}
              </span>
            )}
          </div>
          <div className="checkbox-container privacy-checkbox">
            <input
              type="checkbox"
              {...register("privacyAccepted", {
                required: "You must accept the privacy policy",
              })}
              id="privacyAccepted"
            />
            <label htmlFor="privacyAccepted">
              אני מאשר שקראתי את מדיניות הפרטיות
            </label>
            {errors.privacyAccepted && (
              <span className="error-message">
                {errors.privacyAccepted.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="signup-button blue-ellipse"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "הרשמה"}
          </button>
        </form>
        <div className="overlap-group-2">
          <p className="p">
            <span className="span">כבר רשומים? היכנסו </span>
            <Link to="/login" className="text-wrapper-2">
              לאיזור האישי
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
