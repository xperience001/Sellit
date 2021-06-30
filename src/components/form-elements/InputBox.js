import React, { useCallback } from 'react'

function InputBox({label, name, onInputBoxChange, stateVal}) {

  const handleInputChange = useCallback((e) => {
    onInputBoxChange(e.target.value)
  }, [onInputBoxChange])

  return (
    <div className="my-2">
      <label className="my-2 block text-sm">{label}</label>
      <input type="text" required
        onChange={handleInputChange} 
        value={stateVal}
        name={name} className="border outline-none p-2 px-3 w-full" 
      />
    </div>
  )
}

export default InputBox
