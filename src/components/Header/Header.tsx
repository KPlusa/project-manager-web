import { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Logo from "../Logo/Logo";

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleDropdownToggle = () => {
    clearTimeout(timeoutRef.current!);
    setDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
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
                title="Wykaz projektów"
                id="collasible-nav-dropdown"
                onMouseEnter={handleDropdownToggle}
                onMouseLeave={handleDropdownClose}
                show={dropdownOpen}

              >
                <NavDropdown.Item href="/project">
                  Projekty
                </NavDropdown.Item>
                <NavDropdown.Item href="/project-type">
                  Rodzaje projektów
                </NavDropdown.Item>
                <NavDropdown.Item href="/project-status">
                  Statusy Projektów
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
