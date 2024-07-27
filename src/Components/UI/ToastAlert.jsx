import React from "react";

const ToastAlert = (props) => {
  return (
    <div className={`toast_alert ${props.state}`}>
      <div className="icon">
        <i className="fas fa-check-circle"></i>
      </div>
      <div className="message">
        <p>
          <strong>{props.message}</strong>
        </p>
      </div>
    </div>
  );
};

export default ToastAlert;
