import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact";
import { Box } from "@mui/material";
import { Add, Goto, More, Basic } from "components/Button";
import { SubscriptionController } from "components/Subscription";

function PatientDetailToolbarAction({
  activeIndex,
  onTabChange,
  showAppointmentDialog,
  showPaymentDialog,
  showNoteDialog,
  showProcedureDialog,
}) {
  const navigate = useNavigate();
  const menuLeft = useRef(null);

  // on payment plan handler
  const handleTabChange = (index) => {
    onTabChange({ index });
  };

  switch (activeIndex) {
    case 0:
      return (
        <SubscriptionController type="storage">
          <Add label="Randevu Ekle" onClick={showAppointmentDialog} />
        </SubscriptionController>
      );
    case 1:
      return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <SubscriptionController type="storage">
            <Add
              label="Ödeme Planı Ekle"
              onClick={() => showPaymentDialog("plan")}
            />
          </SubscriptionController>
          <SubscriptionController type="storage">
            <Add
              label="Ödeme Ekle"
              onClick={() => showPaymentDialog("payment")}
            />
          </SubscriptionController>
        </Box>
      );
    case 2:
      return (
        <SubscriptionController type="storage">
          <Add label="Not Ekle" onClick={showNoteDialog} />
        </SubscriptionController>
      );
    case 3:
      return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <More onClick={(event) => menuLeft.current.toggle(event)} />
          <Menu
            model={[
              {
                template: () => (
                  <Basic
                    label="Tedavi Ayarları"
                    icon="pi pi-cog"
                    onClick={() => navigate("/procedures")}
                  />
                ),
              },
            ]}
            ref={menuLeft}
            id="popup_menu_left"
            popup
            style={{
              padding: "0.25rem",
            }}
          />
          <Goto label="Ödeme Planına Git" onClick={() => handleTabChange(1)} />
          <SubscriptionController type="storage">
            <Add label="Tedavi Ekle" onClick={showProcedureDialog} />
          </SubscriptionController>
        </Box>
      );
    // case 4:
    //   return null;
    default:
      return null;
  }
}

export default PatientDetailToolbarAction;
