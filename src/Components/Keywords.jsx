import React from "react";

const Keywords = (props) => {
  return (
    <div className="keywords">
      {props.keywords.map((keyword, index) => (
        <span key={index} className="keyword">
          #{keyword}
        </span>
      ))}
    </div>
  );
};

export default Keywords;
