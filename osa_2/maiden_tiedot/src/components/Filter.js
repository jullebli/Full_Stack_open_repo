import React from 'react'

const Filter = ({value, onChange}) => {
  return (
    <form>
      <div>find countries <input value={value} onChange={onChange}/></div>
    </form>
  )
}

export default Filter