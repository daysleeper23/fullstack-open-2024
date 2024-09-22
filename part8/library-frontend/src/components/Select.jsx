const Select = (props) => {
  // console.log(props)
  return (
    <div>
      <label htmlFor="input-label" className="block text-md font-medium mb-2">{props.label}</label>
      <select
        className="py-3 px-4 pe-9 block w-full border-gray-200 border-x border-y rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        value={props.field.value}
        onChange={props.field.onChange}
        required={props.required}
      >
        <option value="">Open this select menu</option>
        {props.data.map((a) => <option key={a.name}>{a.name}</option>)}
      </select>
    </div>
  )
}
export default Select