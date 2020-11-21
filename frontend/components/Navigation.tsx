import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";

const Navigation = (props: IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="navigation">
      <Navbar className={"navbar"} color="dark" dark expand="md">
        <NavbarBrand href="/">lmrdashboard</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="https://www.reddit.com/r/linuxmasterrace/">
                Subreddit
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://kiwiirc.com/nextclient/irc.snoonet.org/#linuxmasterrace">
                Web IRC
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/aboft/lmrdashboard">
                Source
              </NavLink>
            </NavItem>
          </Nav>
          <NavbarText>linux good windows bad</NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Navigation;

interface IProps {
  title?: string;
}
