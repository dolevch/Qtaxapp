import React from "react";

const GreyBox = () => {
  const styles = {
    box: {
      height: "92px",
      width: "200%",
      backgroundColor: "#f6f7f7",
      position: "relative",
      zIndex: -1,
    },
  };

  return <div style={styles.box} />;
};

export default GreyBox;
