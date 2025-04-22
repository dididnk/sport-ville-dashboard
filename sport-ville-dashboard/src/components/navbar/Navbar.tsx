import './navbar.scss'

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
        <img src="logo.svg" />
        <span className='appName'>SortVille</span>
      </div>

      <div className="icons">
        <img src="search.svg" alt="" className="icon" />
        <img src="app.svg" alt="" className="icon" />
        <img src="expand.svg" alt="" className="icon" />
        <div className="notification">
          <img src="notifications.svg" alt="" className="icon" />
          <span className='notificationNbr'>1</span>
        </div>
        <div className="user">
          <img className='userProfile' src="https://dididnk.github.io/Portfolio/include/img/profile-1.jpeg" />
          <span className='userName'>Emmanuel</span>
        </div>
        <img src="setting.svg" alt="" className="icon" />
      </div>
    </div>
  )
}

export default Navbar
