import React, { useMemo, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "../styles/AppShell.css";

const drawerWidth = 240;

export default function AppShell() {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);

  // -----------------------------------------
  // Navigation items
  // -----------------------------------------

  const items = useMemo(() => {
    const base = [
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: <DashboardRoundedIcon />,
      },
      {
        label: user?.role === "AGENT" ? "My Cases" : "Cases",
        to: "/cases",
        icon: <FolderRoundedIcon />,
      },
    ];

    if (user?.role === "MANAGER") {
      base.push(
        {
          label: "Create Case",
          to: "/cases/new",
          icon: <AddBoxRoundedIcon />,
        },
        {
          label: "Agents",
          to: "/agents",
          icon: <PeopleRoundedIcon />,
        },
        {
          label: "Audit Logs",
          to: "/audit-logs",
          icon: <HistoryRoundedIcon />,
        }
      );
    }

    base.push({
      label: "Profile",
      to: "/profile",
      icon: <PersonRoundedIcon />,
    });

    return base;
  }, [user]);

  // -----------------------------------------
  // Active navigation
  // -----------------------------------------

  const isActive = (item) => {
    if (item.to === "/cases") {
      return (
        location.pathname === "/cases" ||
        (location.pathname.startsWith("/cases/") &&
          location.pathname !== "/cases/new")
      );
    }

    return location.pathname === item.to;
  };

  // -----------------------------------------
  // Mobile drawer
  // -----------------------------------------

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  // -----------------------------------------
  // Logout
  // -----------------------------------------

  const handleLogout = () => {
    setProfileAnchor(null);
    setMobileOpen(false);
    logout();
  };

  // -----------------------------------------
  // Profile menu
  // -----------------------------------------

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleProfileNavigate = () => {
    setProfileAnchor(null);
    navigate("/profile");
  };

  // -----------------------------------------
  // Drawer content
  // -----------------------------------------

  const drawerContent = (
    <Box className="app-shell__drawer-content">
      {/* Logo */}
      <Toolbar className="app-shell__logo-container">
        <Box className="app-shell__logo-icon">
          <FolderRoundedIcon />
        </Box>

        <Typography className="app-shell__logo-text">
          Mini Case Tracker
        </Typography>
      </Toolbar>

      {/* Navigation */}
      <List className="app-shell__nav-list">
        <Typography className="app-shell__nav-label">
          WORKSPACE
        </Typography>

        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={isActive(item)}
            onClick={handleNavigation}
            className="app-shell__nav-item"
          >
            <ListItemIcon className="app-shell__nav-icon">
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              className="app-shell__nav-text"
            />
          </ListItemButton>
        ))}
      </List>

      {/* Bottom section */}
      <Box className="app-shell__drawer-bottom">
        <Divider className="app-shell__divider" />

        {/* User */}
        <Box className="app-shell__user-card">
          <Avatar className="app-shell__user-avatar">
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>

          <Box className="app-shell__user-info">
            <Typography className="app-shell__user-name">
              {user?.name}
            </Typography>

            <Typography className="app-shell__user-role">
              {user?.role}
            </Typography>
          </Box>
        </Box>

        {/* Logout */}
        <ListItemButton
          onClick={handleLogout}
          className="app-shell__logout"
        >
          <ListItemIcon className="app-shell__logout-icon">
            <LogoutRoundedIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box className="app-shell">
      {/* =====================================================
          DESKTOP SIDEBAR
          Visible from md and above
      ===================================================== */}

      <Drawer
        variant="permanent"
        open
        className="app-shell__drawer app-shell__drawer--desktop"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: drawerWidth,
          flexShrink: 0,
        }}
      >
        {drawerContent}
      </Drawer>

      {/* =====================================================
          MOBILE SIDEBAR
          Visible below md
      ===================================================== */}

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        className="app-shell__drawer app-shell__drawer--mobile"
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <Box component="main" className="app-shell__main">
        {/* App Bar */}
        <AppBar
          position="sticky"
          elevation={0}
          className="app-shell__appbar"
        >
          <Toolbar className="app-shell__toolbar">
            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <IconButton
              className="app-shell__menu-button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <MenuRoundedIcon />
            </IconButton>

            {/* =================================================
                PAGE CONTEXT
            ================================================= */}

            <Box className="app-shell__page-context">
              <Typography className="app-shell__page-title">
                {location.pathname.includes("/cases/")
                  ? "Cases"
                  : "Workspace"}
              </Typography>

              <Typography className="app-shell__page-subtitle">
                Manage your case workflow
              </Typography>
            </Box>

            {/* =================================================
                PROFILE
            ================================================= */}

            <Box
              className="app-shell__profile"
              onClick={handleProfileClick}
            >
              <Avatar className="app-shell__profile-avatar">
                {user?.name?.[0]?.toUpperCase()}
              </Avatar>

              <Box className="app-shell__profile-info">
                <Typography className="app-shell__profile-name">
                  {user?.name}
                </Typography>

                <Typography className="app-shell__profile-role">
                  {user?.role}
                </Typography>
              </Box>
            </Box>

            {/* =================================================
                PROFILE MENU
            ================================================= */}

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              className="app-shell__profile-menu"
            >
              <MenuItem onClick={handleProfileNavigate}>
                <PersonRoundedIcon fontSize="small" />
                <span>Profile</span>
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <LogoutRoundedIcon fontSize="small" />
                <span>Logout</span>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* =====================================================
            PAGE CONTENT
        ===================================================== */}

        <Box className="app-shell__content">
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}