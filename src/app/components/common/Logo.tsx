import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        Creativ
      </span>
      <span className="text-3xl font-extrabold text-gray-800 dark:text-white drop-shadow-[0_0_2px_cyan]">
        AI
      </span>
    </div>
  );
};

export default Logo;
