export default function Navbar({ name }) {
  const logoName = name ? name.split(" ")[0] : "Sodhan";

  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#home" className="logo">
          {logoName}<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#journey">Journey</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#certifications">Certificates</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}