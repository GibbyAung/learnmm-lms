import React from "react";
import Navbar from "./_component/Navbar";
import { Particles } from "@/components/ui/particles";

const LayoutPublic = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 lg:px-8">
        <Particles
          className="fixed inset-0 z-[-1] opacity-50"
          variant="default"
        />
        {children}
      </main>
    </div>
  );
};

export default LayoutPublic;
