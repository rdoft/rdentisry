import React, { useRef } from "react";
import { Menu } from "primereact";
import { Add, Goto, More } from "components/Button";
import { SubscriptionController } from "components/Subscription";

// assets
import { useTheme } from "@mui/material/styles";

function PatientDetailToolbarAction({
  activeIndex,
  onTabChange,
  showAppointmentDialog,
  showPaymentDialog,
  showNoteDialog,
  showProcedureDialog,
}) {
  const theme = useTheme();
  const menuLeft = useRef(null);

  // on payment plan handler
  const handleTabChange = (index) => {
    onTabChange({ index });
  };

  switch (activeIndex) {
    case 0:
      return (
        <SubscriptionController type="storage">
          <Add label="Randevu Ekle" default onClick={showAppointmentDialog} />
        </SubscriptionController>
      );
    case 1:
      return (
        <>
          <SubscriptionController type="storage">
            <Add
              default
              label="Ödeme Ekle"
              onClick={() => showPaymentDialog("payment")}
            />
          </SubscriptionController>
          <SubscriptionController type="storage">
            <Add
              default
              label="Ödeme Planı Ekle"
              onClick={() => showPaymentDialog("plan")}
              style={{ marginLeft: 0 }}
            />
          </SubscriptionController>
        </>
      );
    case 2:
      return (
        <SubscriptionController type="storage">
          <Add default label="Not Ekle" onClick={showNoteDialog} />
        </SubscriptionController>
      );
    case 3:
      return (
        <>
          <SubscriptionController type="storage">
            <Add default label="Tedavi Ekle" onClick={showProcedureDialog} />
          </SubscriptionController>
          <Goto
            default
            label="Ödeme Planına Git"
            onClick={() => handleTabChange(1)}
            style={{
              marginRight: "0.5rem",
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
            }}
          />
          <More onClick={(event) => menuLeft.current.toggle(event)} />
          <Menu
            model={[
              {
                label: "Tedavi Ayarları",
                icon: "pi pi-cog",
                url: "/procedures",
              },
            ]}
            ref={menuLeft}
            id="popup_menu_left"
            popup
          />
        </>
      );
    // case 4:
    //   return null;
    default:
      return null;
  }
}

export default PatientDetailToolbarAction;
