import React from "react";
import { Skeleton, DataTable, Column } from "primereact";

const SkeletonDataTable = () => {
  return (
    <DataTable value={Array(10).fill({})} responsiveLayout="scroll">
      <Column body={() => <Skeleton width="100%" height="2rem" />} />
      <Column body={() => <Skeleton width="100%" height="2rem" />} />
      <Column body={() => <Skeleton width="100%" height="2rem" />} />
      <Column body={() => <Skeleton width="100%" height="2rem" />} />
    </DataTable>
  );
};

export default SkeletonDataTable;
