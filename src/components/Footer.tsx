import type { MouseEvent } from "react";

const Footer = () => {
  const handleBackToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer>
      <div className="footer-content">
        <p>© {new Date().getFullYear()} IMDb Clone</p>
        <p className="footer-attribution">
          <span>Movie data from TMDB</span>
          <a href="#top" onClick={handleBackToTop}>
            Back to top
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
