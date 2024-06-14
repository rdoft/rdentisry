import React, { useRef } from "react";
import { Menu } from "primereact";
import { Add, Goto, More } from "components/Button";

function PatientDetailToolbarAction({
  activeIndex,
  onTabChange,
  showAppointmentDialog,
  showPaymentDialog,
  showNoteDialog,
  showProcedureDialog,
}) {
  const menuLeft = useRef(null);

  // on payment plan handler
  const handleTabChange = (index) => {
    onTabChange({ index });
  };

  switch (activeIndex) {
    case 0:
      return (
        <Add
          label="Randevu Ekle"
          default={true}
          onClick={showAppointmentDialog}
        />
      );
    case 1:
      return (
        <>
          <Add
            label="Ödeme Planı Ekle"
            default={true}
            onClick={() => showPaymentDialog("plan")}
          />
          <Add
            label="Ödeme Ekle"
            default={true}
            onClick={() => showPaymentDialog("payment")}
          />
        </>
      );
    case 2:
      return <Add label="Not Ekle" default={true} onClick={showNoteDialog} />;
    case 3:
      return (
        <>
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
          <More onClick={(event) => menuLeft.current.toggle(event)} />
          <Add
            label="Tedavi Ekle"
            default={true}
            onClick={showProcedureDialog}
          />
          <Goto
            label="Ödeme Planına Git"
            default={true}
            onClick={() => handleTabChange(1)}
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
