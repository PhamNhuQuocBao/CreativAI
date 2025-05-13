import React from "react";
import Logo from "../components/common/Logo";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-[440px] w-full shadow-2xl p-6 rounded-2xl flex flex-col items-center gap-4">
        <Logo />

        {children}
      </div>
    </div>
  );
};

export default Layout;
