import React from "react";
import "./header.css";

const Header = () => {
  return (
    <div className="top-line">
     
      <div className="logo">
        <img src={`${process.env.PUBLIC_URL}/assets/logo.png`} alt="Bottom Left"/>
        {/* <span style={{ color: '#5fd7a3ff' }}>K</span>
        <span style={{ color: '#ff2a00ff' }}>r</span>
        <span style={{ color: '#fee774ff' }}>u</span>
        <span style={{ color: '#3a53b9ff' }}>t</span>
        <span style={{ color: '#000000ff' }}>s</span>
        <span style={{ color: '#d70000ff' }}>h</span>
        <span style={{ color: '#5fd7a3ff' }}>a</span> */}
      </div>
    </div>
  );
};

export default Header;
