import React from "react";

const LoadingSpinner = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f8fafc", // light background
  };

  const spinnerStyle = {
    width: "48px",
    height: "48px",
    border: "4px solid orange", // blue border
    borderTop: "4px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const textStyle = {
    marginTop: "16px",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937", // dark gray
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>Loading...</p>

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
;