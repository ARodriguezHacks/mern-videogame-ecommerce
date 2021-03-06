import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";
import {
  Link as RouterLink,
  useHistory,
  useLocation,
  Route,
} from "react-router-dom";
import {
  Typography,
  Link,
  Paper,
  MenuItem,
  MenuList,
  Popper,
  Button,
  Grow,
  ClickAwayListener,
  List,
  ListItem,
  Drawer,
} from "@material-ui/core";

const useStyles = makeStyles({
  grow: {
    flexGrow: 1,

    "& .MuiOutlinedInput-root": {
      borderRadius: "25px",
    },
  },

  drawer: {
    "& .MuiDrawer-paper": {
      overflowY: "visible",
    },
  },

  logo: {
    fontFamily: "'Redressed', cursive",
  },

  link: {
    display: "flex",
    alignItems: "center",
  },
});

const MobileNavigation = ({ drawer }) => {
  const classes = useStyles();
  const history = useHistory();
  let location = useLocation();

  const [open, setOpen] = useState(false); // User drop down menu
  const [adminOpen, setAdminOpen] = useState(false); // Admin drop down menu
  const [openDrawer, setOpenDrawer] = useState(false); // Sidemenu or Drawer

  const anchorRef = useRef(null);
  const adminAnchorRef = useRef(null);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleAdminToggle = () => {
    setAdminOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    if (open) {
      setOpen(false);
    }
  };

  const adminHandleClose = () => {
    if (adminOpen) {
      setAdminOpen(false);
    }
  };

  const handleDrawer = () => {
    if (open || adminOpen) {
      setOpenDrawer(true);
    } else {
      setOpenDrawer(false);
    }
  };

  const selectDropdownItem = () => {
    if (open) {
      setOpen(false);
      setOpenDrawer(false);
    } else if (adminOpen) {
      setAdminOpen(false);
      setOpenDrawer(false);
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    setOpenDrawer(false);
    if (location.pathname !== "/") {
      history.push("/login");
    }
  };

  return (
    <>
      <MenuIcon htmlColor="black" onClick={() => setOpenDrawer(true)} />
      <Route
        render={({ history }) => <SearchBox history={history} width="90%" />}
      />
      <Drawer
        anchor="left"
        open={openDrawer}
        className={openDrawer ? classes.drawer : null}
      >
        <ClickAwayListener onClickAway={handleDrawer}>
          <List>
            <ListItem>
              <Typography variant="h5" className={classes.logo}>
                Le Magasin Shop
              </Typography>
            </ListItem>

            <ListItem onClick={() => setOpenDrawer(false)}>
              <Link component={RouterLink} to="/" className={classes.link}>
                <img src="../../images/logo.png" alt="Le Magasin Logo" />
              </Link>
            </ListItem>

            {userInfo && (
              <ListItem onClick={() => setOpenDrawer(false)}>
                <Link component={RouterLink} to="/cart">
                  <Typography>
                    <ShoppingCartIcon />
                  </Typography>
                </Link>
              </ListItem>
            )}

            <ListItem>
              {userInfo ? (
                <>
                  <Button
                    ref={anchorRef}
                    aria-controls={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                  >
                    {userInfo.name}
                  </Button>
                  <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    placement="right-start"
                    transition
                    disablePortal
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="menu-list-grow">
                              <MenuItem onClick={selectDropdownItem}>
                                <Link component={RouterLink} to="/profile">
                                  <Typography>Profile</Typography>
                                </Link>
                              </MenuItem>
                              <MenuItem onClick={logoutHandler}>
                                <Typography>Logout</Typography>
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
              ) : (
                <Link
                  component={RouterLink}
                  to="/login"
                  onClick={() => setOpenDrawer(false)}
                >
                  <Typography>Log In</Typography>
                </Link>
              )}
            </ListItem>

            <ListItem>
              {userInfo && userInfo.isAdmin && (
                <>
                  <Button
                    ref={adminAnchorRef}
                    aria-controls={adminOpen ? "admin-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleAdminToggle}
                  >
                    Admin
                  </Button>
                  <Popper
                    open={adminOpen}
                    anchorEl={adminAnchorRef.current}
                    role={undefined}
                    placement="right-start"
                    transition
                    disablePortal
                  >
                    {({ TransitionProps }) => (
                      <Grow {...TransitionProps}>
                        <Paper>
                          <ClickAwayListener onClickAway={adminHandleClose}>
                            <MenuList autoFocusItem={adminOpen} id="admin-menu">
                              <MenuItem onClick={selectDropdownItem}>
                                <Link
                                  component={RouterLink}
                                  to="/admin/userlist"
                                >
                                  <Typography>Users</Typography>
                                </Link>
                              </MenuItem>
                              <MenuItem onClick={selectDropdownItem}>
                                <Link
                                  component={RouterLink}
                                  to="/admin/productlist"
                                >
                                  <Typography>Products</Typography>
                                </Link>
                              </MenuItem>
                              <MenuItem onClick={selectDropdownItem}>
                                <Link
                                  component={RouterLink}
                                  to="/admin/orderlist"
                                >
                                  <Typography>Orders</Typography>
                                </Link>
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
              )}
            </ListItem>
          </List>
        </ClickAwayListener>
      </Drawer>
    </>
  );
};

export default MobileNavigation;
