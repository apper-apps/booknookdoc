import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/components/organisms/Header";
import BottomNavigation from "@/components/molecules/BottomNavigation";
import authService from "@/services/api/authService";

const Layout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  if (!authService.isAuthenticated()) {
    return null;
  }

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