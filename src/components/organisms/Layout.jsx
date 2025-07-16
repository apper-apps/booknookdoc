import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/molecules/BottomNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;