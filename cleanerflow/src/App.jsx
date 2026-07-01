import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "@/pages/not-found";
import Booking from "@/pages/booking";
import Home from "@/pages/home";
import About from "@/pages/about";
import CleaningChecklist from "@/pages/cleaning-checklist";
import AirbnbChecklist from "@/pages/airbnb-checklist";
import OfficeChecklist from "@/pages/office-checklist";
import CleaningProducts from "@/pages/cleaning-products";
import Eco from "@/pages/eco";
import TermsAndConditions from "@/pages/terms-and-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";
import Careers from "@/pages/careers";
import CareersApply from "@/pages/careers-apply";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import LocationPage from "@/pages/location";
import GoogleTag from "./GoogleTag";
import { captureUTMs } from "@/lib/utm";

function GAListener() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    captureUTMs();
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname + search,
        page_location: window.location.href,
      });
    }
  }, [pathname, search]);
  return null;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView({ behavior: "smooth" }); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <GoogleTag />
      <GAListener />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/about" element={<About />} />
        <Route path="/cleaning-checklist" element={<CleaningChecklist />} />
        <Route path="/airbnb-checklist" element={<AirbnbChecklist />} />
        <Route path="/office-checklist" element={<OfficeChecklist />} />
        <Route path="/cleaning-products" element={<CleaningProducts />} />
        <Route path="/eco" element={<Eco />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/careers/apply" element={<CareersApply />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/post/:slug" element={<BlogPost />} />
        <Route path="/locations/:city" element={<LocationPage />} />
        <Route path="/locations/:city/:subcity" element={<LocationPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
