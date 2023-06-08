import { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../Logo/Logo";
import { NavLink } from "react-router-dom";

function Header() {
  const [dropdownProjectsOpen, setDropdownProjectsOpen] = useState(false);
  const [dropdownStatsOpen, setDropdownStatsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleDropdownProjectsToggle = () => {
    clearTimeout(timeoutRef.current!);
    setDropdownProjectsOpen(true);
    setDropdownStatsOpen(false);
  };

  const handleDropdownProjectsClose = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownProjectsOpen(false);
    }, 200);
  };
  const handleDropdownStatsToggle = () => {
    clearTimeout(timeoutRef.current!);
    setDropdownStatsOpen(true);
    setDropdownProjectsOpen(false);
  };

  const handleDropdownStatsClose = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownStatsOpen(false);
    }, 200);
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Strona główna</Nav.Link>
              <NavDropdown
                id="collasible-nav-dropdown"
                onMouseEnter={handleDropdownProjectsToggle}
                onMouseLeave={handleDropdownProjectsClose}
                show={dropdownProjectsOpen}
                title={
                  <NavLink
                    to="/projects"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Wykaz projektów
                  </NavLink>
                }
              >
                <NavDropdown.Item href="/projects">Projekty</NavDropdown.Item>
                <NavDropdown.Item href="/project-types">
                  Rodzaje projektów
                </NavDropdown.Item>
                <NavDropdown.Item href="/project-statuses">
                  Statusy Projektów
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                id="collasible-nav-dropdown"
                onMouseEnter={handleDropdownStatsToggle}
                onMouseLeave={handleDropdownStatsClose}
                show={dropdownStatsOpen}
                title={
                  <NavLink
                    to="/project-stats"
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Statystyki projektów
                  </NavLink>
                }
              >
                <NavDropdown.Item href="/project-types-chart">
                  Projekty graficznie wg rodzaj
                </NavDropdown.Item>
                <NavDropdown.Item href="/project-statuses-chart">
                  Projekty graficznie wg status
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
