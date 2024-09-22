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
    </div>
  )
}
export default NavigationMenu