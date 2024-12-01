import { Routes, Route } from "react-router-dom";

import RootLayout from "@/components/layouts/RootLayout";

import DefaultPage from "@/app";
import LinkStatePage from "@/app/link-state";
import DistanceVectorPage from "@/app/distance-vector";

export default function Router() {
  return (
    <>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<DefaultPage />} />
          <Route path="/distance-vector" element={<DistanceVectorPage />} />
          <Route path="/link-state" element={<LinkStatePage />} />
        </Route>
      </Routes>
    </>
  );
}
