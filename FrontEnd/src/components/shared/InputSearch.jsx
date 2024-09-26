import React, { forwardRef} from 'react'

export const InputSearch = forwardRef((props) => {
  return (
    <input ref={props.ref} type="text" id={props.id} className={`form-control ${props.className}`} onChange={props.onChange} {...props}/>
  )
});
