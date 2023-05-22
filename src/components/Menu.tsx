import React, { useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from './Logo';
import { Link } from 'react-router-dom';

function Menu() {
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
          <Navbar.Brand href="#home">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#strona-glowna">Strona główna</Nav.Link>
              <NavDropdown
                title="Wykaz projektów"
                id="collasible-nav-dropdown"
                onMouseEnter={handleDropdownToggle}
                onMouseLeave={handleDropdownClose}
                show={dropdownOpen}
              >
                <NavDropdown.Item href="#dodaj-rodzaj">
                  dodaj projekt
                </NavDropdown.Item>
                <NavDropdown.Item href="#edycja-rodzaj">
                  edytuj rodzaj projektu
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">
                  Something
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Menu;
