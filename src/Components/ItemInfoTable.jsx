import React from "react";

const InfoItem = (props) => {
  const displayValue =
    typeof props.value === "boolean"
      ? props.value
        ? "Yes"
        : "No"
      : props.value;

  return (
    <div className="info_item">
      <span className="label">{props.label}</span>
      <span className="value">{displayValue}</span>
    </div>
  );
};

const ItemInfoTable = (props) => {
  return (
    <div className="item_info_table">
      {props.details.map((item, index) => (
        <InfoItem key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
};

export default ItemInfoTable;
