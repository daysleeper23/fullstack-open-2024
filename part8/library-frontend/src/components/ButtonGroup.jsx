import { useState } from "react"

const ButtonGroup = ({list, onSelectGenre}) => {
  const [ value, setValue ] = useState('')
  
  const handleClick = (e) => {
    
    if (value !== e.target.value) {
      console.log('click:', e.target.value)
      setValue(e.target.value)
      onSelectGenre(e.target.value)
    }
  }

  return (
    <div className="inline-flex rounded-lg shadow-sm">
      {list.map(item => 
        <button key={item} value={item} onClick={handleClick} type="button" className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
          {item}
        </button>
      )}
      <button key="all" value="all" onClick={handleClick} type="button" className="py-3 px-4 inline-flex items-center gap-x-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
        all genres
      </button>
    </div>
  )
}
export default ButtonGroup