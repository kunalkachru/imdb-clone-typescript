import type { MouseEvent } from "react";
import { useInRouterContext } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const isInRouter = useInRouterContext();

  const handleBackToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    const top = document.getElementById("app-shell-top");

    if (isInRouter) {
      event.preventDefault();
      top?.scrollIntoView();
    }
  };

  return (
    <footer>
      <div className="footer-content">
        <span>© {currentYear} IMDb Clone</span>
        <span>Movie data from TMDB</span>
        <a href="#app-shell-top" onClick={handleBackToTop}>
          Back to top
        </a>
      </div>
    </footer>
  );
};

export default Footer;
