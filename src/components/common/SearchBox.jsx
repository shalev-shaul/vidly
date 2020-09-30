import React from "react";

const SearchBox = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      name="query"
      className="form-control my-3"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
