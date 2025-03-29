import React from "react";
import {
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// assets
import {
  YoutubeIcon,
  InstagramIcon,
  XIcon,
  FacebookIcon,
} from "assets/images/icons";

const youtubeLink = "https://www.youtube.com/@dishekime";
const instagramLink = "https://www.instagram.com/disheki.me";
const xLink = "https://x.com/dishekime";
const facebookLink = "https://www.facebook.com/profile.php?id=61565530527212";
const playlistLink =
  "https://www.youtube.com/embed/videoseries?si=e0kLST0M0J7NStC5&amp;list=PLgsv5B-Bql8VK1tx13nkRVOBZjwh2MxgV";

function TutorialDialog({ open, onClose }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: "90vh",
        },
      }}
      sx={{
        zIndex: theme.zIndex.dialog || 1400,
      }}
    >
      <DialogTitle
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Eğitim Videoları</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          <i
            className="fi fi-rr-cross-small"
            style={{
              fontSize: "16px",
            }}
          ></i>
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: matchDownSM ? 2 : 3,
          "&:first-of-type": {
            pt: matchDownSM ? 2 : 3,
          },
        }}
      >
        <iframe
          width="100%"
          height="400"
          src={playlistLink}
          title="Eğitim Videoları"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ border: "none" }}
        ></iframe>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          borderTop: `1px solid ${theme.palette.divider}`,
          p: matchDownSM ? 2 : 3,
        }}
      >
        <IconButton href={youtubeLink} target="_blank" rel="noreferrer">
          <Avatar
            alt="youtube"
            src={YoutubeIcon}
            sx={{ width: 32, height: 32, padding: "2px" }}
          />
        </IconButton>
        <IconButton href={xLink} target="_blank" rel="noreferrer">
          <Avatar
            alt="x"
            src={XIcon}
            sx={{ width: 24, height: 24, padding: "2px" }}
          />
        </IconButton>
        <IconButton href={instagramLink} target="_blank" rel="noreferrer">
          <Avatar
            alt="instagram"
            src={InstagramIcon}
            sx={{ width: 24, height: 24, padding: "2px" }}
          />
        </IconButton>
        <IconButton href={facebookLink} target="_blank" rel="noreferrer">
          <Avatar
            alt="facebook"
            src={FacebookIcon}
            sx={{ width: 32, height: 32, padding: "4px" }}
          />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}

export default TutorialDialog;
