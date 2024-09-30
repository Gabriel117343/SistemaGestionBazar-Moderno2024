import React, { forwardRef} from 'react'

export const InputSearch = forwardRef((props, ref) => {
  return (
    <input ref={ref} type="text" id={props.id} className={`form-control ${props.className}`} onChange={props.onChange} maxLength={30} {...props}/>
  )
});
