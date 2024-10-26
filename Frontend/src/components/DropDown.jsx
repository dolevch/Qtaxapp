import React from "react";

const DropDown = () => {
  const liStyle = {
    cursor: "pointer",
  };

  return (
    <div className="flex flex-col DropDown">
      <ul className="flex flex-col gap-4">
        <li style={liStyle}>אזור אישי</li>
        <li style={liStyle}>הגדרות</li>
        <li style={liStyle}>התנתקות</li>
      </ul>
    </div>
  );
};

export default DropDown;
