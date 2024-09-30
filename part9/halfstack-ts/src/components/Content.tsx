import Part, { CoursePart } from "./Part"

const Content = ({ list }: { list: CoursePart[] }) => {
  return (
    <div className="space-y-4">
      {
        list.map(element => <Part key={element.name} part={element} />)
      }
    </div>
  )
}
export default Content