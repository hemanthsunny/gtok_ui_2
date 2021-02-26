import React, { useState } from "react";

const DetailComponent = ({ setStepNumber, handleChange, category, setCategory, postCategories }) => {
  const [ alert, setAlert ] = useState("");

  const handleCategory = async (val) => {
    let cat = postCategories.find(c => c.title === val);
    setCategory(cat);
  }

  const goNext = () => {
    if (!category) {
      setAlert("This field is mandatory");
      return null;
    }
    setStepNumber(3);
  }

  const goBack = () => {
    setStepNumber(1);
  }

  return (
    <div className="container feeling-category-wrapper">
      <div className="mb-3">
        <div className="mb-3 header">Category <small className="text-danger">*{alert}</small></div>
        <select className="custom-select font-small" id="inputGroupSelect01" onChange={e => handleCategory(e.target.value)} value={category.title}>
          <option value="">Choose...</option>
          {
            postCategories.map(category => (
              <option value={category.title} key={category.key}>
              {category.title}
              </option>
            ))
          }
        </select>
      </div>
      <button className="btn btn-next" onClick={goBack}>
        Back
      </button>
      <button className="btn btn-next pull-right" onClick={goNext}>
        Next
      </button>
		</div>
  );
};

export default DetailComponent;
