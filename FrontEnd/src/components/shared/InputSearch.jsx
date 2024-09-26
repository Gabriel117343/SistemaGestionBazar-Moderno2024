import React from 'react'

export const InputSearch = (props) => {
  return (
    <input ref={props.ref} type="text" id={props.id} className={`form-control ${props.className}`} onChange={props.onChange} {...props}/>
  )
}
