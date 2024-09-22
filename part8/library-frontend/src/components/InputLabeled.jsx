const InputLabeled = (props) => {
  return (
    <div className="max-w-sm">
      <label htmlFor="input-label" className="block text-md font-medium mb-2">{props.label}</label>
      <input
        className="py-3 px-4 block w-full border-gray-200 border-x border-y rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
        placeholder={props.placeholder}
        value={props.field.value}
        onChange={props.field.onChange}
        required={props.required}
      />
    </div>
  )
}
export default InputLabeled