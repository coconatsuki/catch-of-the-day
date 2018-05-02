import React from "react";

const Header = ({ tagline, age }) => (
  <header className="top">
    <h1>
      Catch
      <span className="ofThe">
        <span className="of">Of</span>
        <span className="the">The</span>
      </span>
      Day
    </h1>
    <h3 className="tagline">
      <span>
        {tagline} {age}
      </span>
    </h3>
  </header>
);

export default Header;
