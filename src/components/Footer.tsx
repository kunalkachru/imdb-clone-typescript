const Footer = () => {
  const handleBackToTop = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.scrollTo(0, 0);
  };

  return (
    <footer>
      <p>
        <span>© {new Date().getFullYear()} IMDb Clone</span>
        <span> Movie data from TMDB</span>
        <span> </span>
        <a href="" role="link" onClick={handleBackToTop}>
          Back to top
        </a>
      </p>
    </footer>
  );
};

export default Footer;
