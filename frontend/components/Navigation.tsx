import React, { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import packageJson from "../package.json";

const Navigation = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="navigation">
      <Navbar className={'navbar'} expand="md" dark>
        <NavbarBrand className={'navbar-brand'} href="/">
          lmrdashboard
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="https://www.reddit.com/r/linuxmasterrace/">Subreddit</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://kiwiirc.com/nextclient/irc.snoonet.org/#linuxmasterrace">Web IRC</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/r-lmr/lmrdashboard">Source</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href=" http://linuxmasterrace.org">linuxmasterrace.org</NavLink>
            </NavItem>
          </Nav>
          <NavLink href={"https://github.com/r-lmr/lmrdashboard/releases/tag/" + packageJson.version}>
            v{packageJson.version}
          </NavLink>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;
