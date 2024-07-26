import { React } from "react";
import { Link } from "react-router-dom";
import { Typography, Divider } from "@mui/material";

function LegalFooter() {
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        textAlign: "center",
        padding: "1rem 0",
      }}
    >
      <Divider style={{ margin: "2rem 0" }} />
      <div className="flex justify-content-center">
        <Typography variant="caption">
          <Link
            to="/legal/privacy"
            style={{ textDecoration: "none", color: "#21273C" }}
          >
            Gizlilik Politikası
          </Link>{" "}
        </Typography>
        <Divider
          orientation="vertical"
          flexItem
          style={{ margin: "0 1rem", backgroundColor: "#21273C", width: "2px" }}
        />
        <Typography variant="caption">
          <Link
            to="/legal/terms"
            style={{ textDecoration: "none", color: "#21273C" }}
          >
            Kullanım Hükümleri
          </Link>
        </Typography>
      </div>
    </div>
  );
}

export default LegalFooter;
