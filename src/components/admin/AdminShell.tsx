"use client";

import { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", href: "/admin", icon: <DashboardIcon /> },
  { label: "Kelola Order", href: "/admin/orders", icon: <ListAltIcon /> },
  { label: "Promo", href: "/admin/promos", icon: <LocalOfferIcon /> },
  { label: "Laporan", href: "/admin/reports", icon: <BarChartIcon /> },
  { label: "Pengaturan", href: "/admin/settings", icon: <SettingsIcon /> },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const drawerContent = (
    <Box>
      <Toolbar>
        <LocalLaundryServiceIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }} noWrap>
          Wangsit Admin
        </Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component={NextLink}
              href={item.href}
              selected={pathname === item.href}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton onClick={() => signOut({ callbackUrl: "/auth/login" })}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Keluar" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1, display: { md: "none" } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Wangsit Admin
          </Typography>
          <ThemeToggle />
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: { xs: 8, md: 0 },
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
