"use client";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (pathname.startsWith("/admin")) return null;

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
      <Toolbar sx={{ gap: 1 }}>
        <LocalLaundryServiceIcon color="primary" />
        <Typography
          component={NextLink}
          href="/"
          variant="h6"
          fontWeight="bold"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Wangsit Laundry
        </Typography>

        {status === "loading" ? null : !user ? (
          <Button component={NextLink} href="/auth/login" variant="contained" size="small">
            Login
          </Button>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={user.image ?? undefined}
              alt={user.name ?? ""}
              sx={{ width: 32, height: 32, fontSize: 14 }}
            >
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" fontWeight="medium" lineHeight={1.2}>
                {user.name}
              </Typography>
              <Chip
                label={isAdmin ? "Admin" : "Client"}
                size="small"
                color={isAdmin ? "error" : "primary"}
                sx={{ height: 16, fontSize: 10 }}
              />
            </Box>
            {isAdmin && (
              <Tooltip title="Panel Admin">
                <IconButton component={NextLink} href="/admin" size="small" color="error">
                  <AdminPanelSettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Keluar">
              <IconButton size="small" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
