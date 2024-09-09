import React from 'react'
import './shared.css'
export const ButtonNew = (props) => {

  return (
    <button onClick={props.onClick} className='btn btn-primary btn-nuevo-animacion'><i className='bi bi-plus-circle-fill'></i> {props.children}</button>
  )
}
