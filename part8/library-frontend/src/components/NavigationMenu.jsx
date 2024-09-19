import { Link } from "react-router-dom"

const NavigationMenu = () => {
  return (
    <div>
      <Link to="/authors"><button>Authors</button></Link>
      <Link to="/books"><button>Books</button></Link>
      <Link to="/add-book"><button>Add book</button></Link>
    </div>
  )
}
export default NavigationMenu