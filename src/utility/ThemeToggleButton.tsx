import React from "react";

const ThemeToggleButton: React.FC = () => {
  const toggleTheme = () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
};

export default ThemeToggleButton;
