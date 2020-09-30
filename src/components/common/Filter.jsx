import React from "react";

const Filter = ({ onFilter, currectGanre, genres }) => {
  return (
    <ul className="list-group">
      {genres.map((f) => (
        <li
          style={{ cursor: "pointer" }}
          onClick={() => onFilter(f)}
          key={f._id ? f._id : f.name}
          className={
            currectGanre.name === f.name
              ? "list-group-item active"
              : "list-group-item"
          }
        >
          {f.name}
        </li>
      ))}
    </ul>
  );
};

export default Filter;
