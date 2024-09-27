interface CoursePart {
  name: string,
  exerciseCount: number
}

const Content = ({ list }: { list: CoursePart[] }) => {
  return (
    <div className="space-y-4">
      {
        list.map(element => 
          <p>
            {element.name} {element.exerciseCount}
          </p>
        )
      }
    </div>
  )
}
export default Content