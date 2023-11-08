import React from 'react'
import ReactDOM from 'react-dom'
import loaderGIF from '../../../assets/loader.gif'
import './Loader.css'
function LoaderEl() {
  return (
    <div className='loadingParent'>
      <img src={loaderGIF} alt='loading' />
    </div>
  )
}


export default LoaderEl;