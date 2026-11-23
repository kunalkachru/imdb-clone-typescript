const Footer = () => (
  <footer>
    <p className="footer-content">
      <span>Movie data from TMDB</span>
      <span>© {new Date().getFullYear()} IMDb Clone</span>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Back to top
      </button>
    </p>
  </footer>
);

export default Footer;
