import React, { useContext, useEffect, useState } from "react";

import { useDispatch } from "react-redux";

function EditButton(props) {
  const dispatch = useDispatch();

  const [isEditClicked, setIsEditClicked] = useState(false);

  //   useEffect(() => {
  //       const editButtonClickHandler =async () => {
  //         updateFormValuesChanged(!formValuesChanged)
  //        await dispatch(edit({expense:{...props.expenseObj},isEdit:true}))
  //         updateFormValuesChanged(!formValuesChanged)
  //     }

  // if(isEditClicked){
  //   editButtonClickHandler()
  // }

  //   },[isEditClicked])
  return (
    <button
      onClick={() => setIsEditClicked(true)}
      className="btn-warning rounded"
    >
      Edit
    </button>
  );
}

export default EditButton;
