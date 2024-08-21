import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = (props) => {
  return (
    <div className="bread_crumbs">
      <ul>
        {props.links.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <Link to={item.path}>{item.title}</Link>
            </li>
            {index < props.links.length - 1 && (
              <span className="separator">/</span>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
