import React from "react";
import { Skeleton, DataTable, Column } from "primereact";

function SkeletonList() {
  const skeletonRows = Array.from({ length: 5 });

  return (
    <DataTable value={skeletonRows} size="small">
      {/* Tooth Number Column */}
      <Column
        header={<Skeleton height="1.5rem" width="85%" />}
        body={() => <Skeleton height="1.5rem" width="85%" />}
        style={{ padding: "5px", width: "18rem" }}
      />
      {/* Status Column */}
      <Column
        header={<Skeleton height="1.5rem" width="80%" />}
        body={() => <Skeleton height="1.5rem" width="80%" />}
        style={{ padding: "5px", width: "8rem" }}
      />
      {/* Procedure Name and Category Column */}
      <Column
        body={() => <Skeleton shape="circle" size="2rem" />}
        style={{ padding: "5px", width: "2rem" }}
      />
      <Column
        header={<Skeleton height="1.5rem" width="60%" />}
        body={() => <Skeleton height="1.5rem" width="60%" />}
      />
      {/* Price Column */}
      <Column
        header={<Skeleton height="1.5rem" width="85%" />}
        body={() => <Skeleton height="1.5rem" width="85%" />}
        style={{ padding: "5px", width: "12rem", minWidth: "12rem" }}
      />
    </DataTable>
  );
}

export default SkeletonList;
