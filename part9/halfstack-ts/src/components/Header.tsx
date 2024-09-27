interface HeaderProps {
  name: string
}

const Header = ({ name }: { name: string }) => {
  return (
    <h1 className="text-3xl font-bold">{name}</h1>
  )
}
export default Header