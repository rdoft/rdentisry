import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "context/AuthProvider";
import { useSubscription } from "context/SubscriptionProvider";
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Tab,
  Tabs,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project import
import { Logout } from "components/Button";
import { MainCard } from "components/cards";
import Transitions from "components/@extended/Transitions";
import ProfileTab from "./ProfileTab";
import SettingTab from "./SettingTab";

// assets
import dentalSvg from "assets/svg/profile/dental.svg";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";

// services
import { AuthService, UserService } from "services";

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    "aria-controls": `profile-tabpanel-${index}`,
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { unauthenticate } = useAuth();
  const { refresh } = useSubscription();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Profil");
  const [email, setEmail] = useState("");
  const [value, setValue] = useState(0);

  // Arrange user name for the profile
  const username = name
    ? name.length > 20
      ? name.slice(0, 20) + "..."
      : name
    : "Klinik / Diş Hekimi";

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    UserService.getUser({ signal })
      .then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });

    return () => {
      controller.abort();
    };
  }, []);

  // HANDLERS ---------------------------------------------------------
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      unauthenticate();
      refresh();
      navigate(`/login`);
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  const popperPlacement = matchDownSM ? "top" : "right-start";

  return (
    <Box sx={{ width: "100%" }}>
      <ButtonBase
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          color: open
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
          bgcolor: open ? theme.palette.background.secondary : "transparent",
          "&:hover": {
            bgcolor: theme.palette.background.secondary,
          },
          border: `1px solid ${theme.palette.divider}`,
          mx: "auto",
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Avatar
          alt="profile user"
          src={dentalSvg}
          sx={{
            width: 28,
            height: 28,
            bgcolor: theme.palette.background.default,
          }}
        />
        <Stack
          spacing={0}
          sx={{
            ml: 1.5,
            flex: 1,
            overflow: "hidden",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              lineHeight: 1.2,
            }}
          >
            {username}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              color: theme.palette.grey[600],
              lineHeight: 1.2,
            }}
          >
            {email}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement={popperPlacement}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal={matchDownSM}
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, matchDownSM ? 0 : 9],
              },
            },
          ],
        }}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: matchDownSM ? "100%" : 320,
          ...(matchDownSM && {
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            px: 2,
            pb: 2,
          }),
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.12)",
                width: "100%",
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                ...(matchDownSM && {
                  borderRadius: "16px 16px 0 0",
                  py: 1.5,
                }),
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  elevation={0}
                  border={false}
                  content={false}
                  sx={{
                    bgcolor: "transparent",
                    borderRadius: "inherit",
                  }}
                >
                  <CardContent sx={{ p: 2, pb: 2 }}>
                    <Grid container spacing={1.5} alignItems="center">
                      <Grid item>
                        <Avatar
                          alt="profile user"
                          src={dentalSvg}
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.background.default,
                          }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h5" color="text.primary">
                          {username}
                        </Typography>
                        <Typography variant="caption" color="grey.600">
                          {email}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChange}
                      aria-label="profile tabs"
                      sx={{
                        "& .MuiTab-root": {
                          minHeight: 40,
                          py: 0,
                          color: theme.palette.text.primary,
                        },
                      }}
                    >
                      <Tab
                        icon={
                          <UserOutlined
                            style={{ fontSize: "1rem", marginRight: "6px" }}
                          />
                        }
                        label="Profil"
                        {...a11yProps(0)}
                      />
                      <Tab
                        icon={
                          <SettingOutlined
                            style={{ fontSize: "1rem", marginRight: "6px" }}
                          />
                        }
                        label="Ayarlar"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab name={name} setName={setName} />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab />
                  </TabPanel>
                  <Box
                    sx={{
                      p: 2,
                      pt: 1,
                      borderTop: 1,
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Logout onClick={handleLogout} />
                  </Box>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
