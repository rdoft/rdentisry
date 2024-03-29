// material-ui
import { Box } from "@mui/material";

// project import
// import Search from "./Search";
import Profile from "./Profile/Profile";
import Notification from "./Notification/Notification";
// import MobileSection from "./MobileSection";

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  // const matchesXs = useMediaQuery((theme) => theme.breakpoints.down("md"));

  return (
    <>
      {/* {!matchesXs && <Search />} */}
      {<Box sx={{ width: "100%", ml: 1 }} />}

      <Notification />
      {/* {!matchesXs && <Profile />} */}
      <Profile />
      {/* {matchesXs && <MobileSection />} */}
    </>
  );
};

export default HeaderContent;
