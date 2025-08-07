import React from "react";

const Header = () => {
  return (
    <div
      className="header"
      style={{ textAlign: "center", marginBottom: "2rem" }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "700",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "0.5rem",
        }}
      >
        Choose-Wise
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#4a5568",
          fontWeight: "300",
          marginBottom: "1rem",
        }}
      >
        Get unbiased, wise advice on any decision
      </p>
      <p
        style={{
          color: "#718096",
          fontSize: "1rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        Making tough choices? Let AI help you think through your options
        objectively with real analysis from leading AI models. Simply enter your
        choices and any thoughts you have about them.
      </p>
    </div>
  );
};

export default Header;
