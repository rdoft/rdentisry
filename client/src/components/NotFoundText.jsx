import React from "react";

function NotFoundText({ text, p = 2 }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "8px" }}>
      <p className={`text-center p-${p}`}>{text}</p>
    </div>
  );
}

export default NotFoundText;
