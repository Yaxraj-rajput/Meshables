import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = (props) => {
  return (
    <div className="bread_crumbs">
      <ul>
        {/* <li>
          <Link to="/">Home</Link>
        </li>
        <span className="separator">/</span>
        <li>
          <Link to="/Models">Models</Link>
        </li>
        <span className="separator">/</span>
        <li>
          <Link to="/View">Sofa 3d model with textures and materials</Link>
        </li> */}

        {props.links.map((item, index) => (
          <>
            <li key={index}>
              <Link to={item.path}>{item.title}</Link>
            </li>

            {index < props.links.length - 1 && (
              <span className="separator">/</span>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
