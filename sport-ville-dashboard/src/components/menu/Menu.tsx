import { Link } from 'react-router-dom'
import './menu.scss'
import { menu } from './menu.ts'

function Menu() {
  return (
    <div className='menu'>
      {menu.map((item) =>
        <div className="item" key={item.id}>
          <span className="title">{item.tittle}</span>
          {item.listItems.map((list) =>
            <Link to={list.url} className='listItem' key={list.id}>
              <img src={list.icon} alt={list.title} className='icon' />
              <span className="listItemTitle">{list.title}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Menu
