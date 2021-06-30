import React, { useCallback } from 'react'

function TextAreaBox({label, name, onInputBoxChange, stateVal}) {

  const handleInputChange = useCallback((e) => {
    onInputBoxChange(e.target.value)
  }, [onInputBoxChange])

  return (
    <div className="my-2">
      <label className="my-2 block text-sm">{label}</label>
      <textarea required
        onChange={handleInputChange} 
        value={stateVal}
        name={name} className="border outline-none p-2 px-3 w-full" 
      >{stateVal}</textarea>
    </div>
  )
}

export default TextAreaBox
