import React, { useEffect, useState } from "react";

const APITestComponent = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/test")
      .then((response) => {
        console.log("Response status:", response.status);
        return response.text(); // Change this line
      })
      .then((text) => {
        console.log("Raw response:", text); // Add this line
        try {
          const data = JSON.parse(text);
          console.log("Parsed data:", data);
          setMessage(data.message);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          setError("Invalid JSON response");
        }
      })
      .catch((e) => {
        console.error("Fetch error:", e);
        setError(e.message);
      });
  }, []);

  return (
    <div>
      <h2>API Test</h2>
      {message && <p>Message from API: {message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default APITestComponent;
