import Header from "@/components/Header";
import { mustBeLoggedIn } from "@/lib/auth";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  await mustBeLoggedIn();
  return (
    <div>
      <Header />
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
};

export default DashboardLayout;
