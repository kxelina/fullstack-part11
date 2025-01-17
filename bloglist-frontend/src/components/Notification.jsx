import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification)

  if (!notification.message) {
    return null
  }

  let className = ''
  if (notification.type === 'error') {
    className = 'error'
  } else if (notification.type === 'success') {
    className = 'success'
  }

  return (
    <div className={className}>
      {notification.message}
    </div>
  )
}

export default Notification