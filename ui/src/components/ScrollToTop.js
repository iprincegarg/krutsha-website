import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Temporarily disable CSS smooth scrolling
    document.documentElement.style.scrollBehavior = "auto";
    
    // Jump instantly
    window.scrollTo(0, 0);
    
    // Restore the smooth scroll behavior from CSS
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "";
    }, 50);
  }, [pathname]);

  return null;
}
