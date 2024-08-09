import React, { useState } from "react";
import { Dropdown } from "primereact";
import { ProcedureCategory } from "components/ProcedureCategory";

// assets
import "assets/styles/ProceedureTable/CategoryColumn.css";

// Create a component for category column that is dropdown menu and save the changes
function CategoryColumn({ procedure, categories, onSubmit }) {
  const [category, setCategory] = useState(procedure.procedureCategory);

  // HANDLERS -----------------------------------------------------------------
  // onChange handler and set the category of the procedure
  const handleChange = (event) => {
    const value = event.target.value;
    setCategory(value);
    onSubmit({
      ...procedure,
      procedureCategory: value,
    });
  };

  // TEMPLATES -----------------------------------------------------------------
  // Category value template
  const categoryItemTemplate = (option) => {
    return <ProcedureCategory category={option?.title} />;
  };

  return (
    <Dropdown
      value={category}
      options={categories}
      optionLabel="title"
      valueTemplate={categoryItemTemplate}
      itemTemplate={categoryItemTemplate}
      onChange={handleChange}
      className="categoryDropdown w-full"
      placeholder="Kategori seçiniz..."
    />
  );
}

export default CategoryColumn;
