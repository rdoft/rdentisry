import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Divider } from "primereact";
import { useAuth } from "context/AuthProvider";
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

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Profil");
  const [value, setValue] = useState(0);

  const iconBackColorOpen = "grey.300";
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

      // Set Unauthenticated for all routes
      unauthenticate();
      navigate(`/login`);
    } catch (error) {
      error.message && toast.error(error.message);
    }
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open.current ? iconBackColorOpen : "transparent",
          borderRadius: 1,
          "&:hover": { bgcolor: "secondary.lighter" },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open.current ? "profile-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ p: 0.5 }}>
          <Avatar
            alt="profile user"
            src={dentalSvg}
            sx={{ width: 24, height: 24 }}
          />
          <Stack>
            <Typography variant="h6">{username}</Typography>
          </Stack>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 290,
                  minWidth: 240,
                  maxWidth: 290,
                  [theme.breakpoints.down("md")]: {
                    maxWidth: 250,
                  },
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Stack
                            direction="row"
                            spacing={1.25}
                            alignItems="center"
                          >
                            <Avatar
                              alt="profile user"
                              src={dentalSvg}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Stack>
                              <Typography variant="h5" fontWeight="light">
                                {username}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <Tabs
                            variant="fullWidth"
                            value={value}
                            onChange={handleChange}
                            aria-label="profile tabs"
                            sx={{
                              borderBottom: 1,
                              borderColor: "divider",
                              "& .MuiTabs-indicator": {
                                bgcolor: theme.palette.text.secondary,
                              },
                            }}
                          >
                            <Tab
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize",
                                "&:hover": {
                                  bgcolor: theme.palette.background.secondary,
                                  borderRadius: "10px",
                                },
                                "&.Mui-selected": {
                                  color: theme.palette.text.secondary,
                                },
                              }}
                              icon={
                                <UserOutlined
                                  style={{
                                    marginBottom: 0,
                                    marginRight: "10px",
                                  }}
                                />
                              }
                              label="Hesap"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                textTransform: "capitalize",
                                "&:hover": {
                                  bgcolor: theme.palette.background.secondary,
                                  borderRadius: "10px",
                                },
                                "&.Mui-selected": {
                                  color: theme.palette.text.secondary,
                                },
                              }}
                              icon={
                                <SettingOutlined
                                  style={{
                                    marginBottom: 0,
                                    marginRight: "10px",
                                  }}
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
                        <Divider className="mt-3 mb-1" />
                        <Logout onClick={handleLogout} style={{ margin: 4 }} />
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;
