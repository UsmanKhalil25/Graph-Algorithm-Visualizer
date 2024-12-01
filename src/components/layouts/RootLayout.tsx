import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
    </div>
  );
}
