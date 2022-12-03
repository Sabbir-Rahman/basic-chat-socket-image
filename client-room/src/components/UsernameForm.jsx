import React from 'react'

const Form = (props) => {
  return(
    <form>
      <input
        placeholder='Username...'
        type="text"
        value={props.username}
        onChange={props.onChange}
      />
    </form>
  )
}

export default Form