import React from "react";
import { Menu, Button, Dropdown, Image, Container } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { withAuth } from "../../auth";

const Navbar = ({ auth }) => {
  const { isAuthenticated, logout, getProfile } = auth;

  return (
    <>
      {isAuthenticated() && (
        <Menu stackable fixed="top" size="small">
          <Container>
            <Menu.Item className="brand" name="home">
              <Link to="/">SocialPoll</Link>
            </Menu.Item>

            <Menu.Menu position="right">
              <Menu.Item name="home">
                <Link to="/">Home</Link>
              </Menu.Item>

              <Menu.Item name="form">
                <Link to="/create-poll">Create Poll</Link>
              </Menu.Item>

              <Menu.Item name="sign-in">
                {/* <Button onClick={logout}>Log Out</Button> */}
                <Dropdown
                  trigger={
                    isAuthenticated() ? (
                      <span>
                        <Image avatar src={getProfile().picture} size="mini" />
                      </span>
                    ) : (
                      <div />
                    )
                  }
                  icon={null}
                  item
                >
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Button onClick={logout}>Log Out</Button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
      )}
    </>
  );
};

export default withAuth(Navbar);
