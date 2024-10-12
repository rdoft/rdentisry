import React from "react";
import {
  IconButton,
  Avatar,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";

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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle
        textAlign="center"
        variant="h2"
        fontWeight="light"
        mt={1}
        mb={2}
      >
        Eğitim Videoları
      </DialogTitle>

      <DialogContent>
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
        sx={{ justifyContent: "center", borderTop: "0.5px solid" }}
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
