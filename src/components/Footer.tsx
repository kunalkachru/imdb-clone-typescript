const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-content">
        <span>© {currentYear} IMDb Clone</span>
        <span>Movie data from TMDB</span>
        <a href="#app-shell-top">Back to top</a>
      </div>
    </footer>
  );
};

export default Footer;
