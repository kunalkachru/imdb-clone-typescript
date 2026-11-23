const Footer = () => (
  <footer>
    <div className="footer-content">
      <p>© {new Date().getFullYear()} IMDb Clone</p>
      <p className="footer-attribution">
        <span>Movie data from TMDB</span>
        <a href="#top">Back to top</a>
      </p>
    </div>
  </footer>
);

export default Footer;
