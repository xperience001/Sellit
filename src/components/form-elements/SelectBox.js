import React, { useCallback } from 'react'

function SelectBox({label, name, optionList, onInputBoxChange, stateVal, isBeingEdited}) {

  const handleInputChange = useCallback((e) => {
    onInputBoxChange(e.target.value)
  }, [onInputBoxChange])

  return (
    <div className="my-2">
      <label className="my-2 block text-sm">{label}</label>
      <select id={stateVal} onChange={handleInputChange} required
        value={stateVal}
        name={name} className="border outline-none p-2 px-3 w-full" 
      >
        {(typeof optionList != "undefined") ? (
          optionList.map((category, key) => {
						<option value="">-- Choose from list --</option>
						const option = <option value={category.id} key={key}>{category.name}</option>
            return option
          })
        ) :('')}
      </select>
    </div>
  )
}

export default SelectBox
