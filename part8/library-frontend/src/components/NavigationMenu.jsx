import { Link } from "react-router-dom"
import Button from "./Button"

const NavigationMenu = () => {
  return (
    <div>
      <Link to="/authors">
        <Button variant="link">
          Authors
        </Button>
        {/* <button>Authors</button> */}
      </Link>
      <Link to="/books">
        <Button variant="link">Books</Button>
      </Link>
      <Link to="/add-book">
        <Button variant="link">Add book</Button>
      </Link>
      <Link to="/recommendations">
        <Button variant="link">Recommendations</Button>
      </Link>
      <Link to="/login">
        <Button variant="link">Login</Button>
      </Link>
    </div>
  )
}
export default NavigationMenu