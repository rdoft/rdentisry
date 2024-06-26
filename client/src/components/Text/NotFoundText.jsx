import React from "react";

function NotFoundText({ text, ...props }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        ...props.style,
      }}
    >
      <p className={`text-center p-${props.p ?? 2} m-${props.m ?? 0}`}>
        {text}
      </p>
    </div>
  );
}

export default NotFoundText;
