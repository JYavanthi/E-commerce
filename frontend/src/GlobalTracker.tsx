import React from "react";
import { usePageTracker } from "./hooks/usePageTracker";


const GlobalTracker = ({ children }: { children: React.ReactNode }) => {
usePageTracker();
return <>{children}</>;
};


export default GlobalTracker;