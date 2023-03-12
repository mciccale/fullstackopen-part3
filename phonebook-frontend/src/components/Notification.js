import React from 'react'

const Notification = ({ notification, error }) => {
  if (notification !== null) {
    return (
      <div className='notification'>
        <span>{notification}</span>
      </div>
    )
  } else if (error !== null) {
    return (
      <div className='error'>
        <span>{error}</span>
      </div>
    )
  } else {
    return null
  }
}

export default Notification
