import React from "react";

function NotFoundText({ text, p = 2}) { 
  return (
    <p className={`text-center p-${p}`}>{text}</p>
  );
}

export default NotFoundText;
  