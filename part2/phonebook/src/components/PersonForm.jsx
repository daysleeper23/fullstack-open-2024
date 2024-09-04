const PersonForm = ({ name, number, submitHandler, nameChangeHandler, numChangeHandler }) => {
  return (
    <form onSubmit={submitHandler}>
      <div>
        name: <input id="name" value={name} onChange={nameChangeHandler}/>
      </div>
      <div>
        number: <input value={number} onChange={numChangeHandler}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm