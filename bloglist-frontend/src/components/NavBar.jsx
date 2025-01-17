import { Link } from 'react-router-dom'

const Navbar = ({ user, handleLogout }) => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
        <li >
          <Link to="/">blogs</Link>
        </li>
        <li style={{ margin: '0 10px' }}>
          <Link to="/users">users</Link>
        </li>
        {user && (
          <>
            <li >{user.username} logged in</li>
            <li style={{ margin: '0 10px' }}>
              <button onClick={handleLogout}>logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
