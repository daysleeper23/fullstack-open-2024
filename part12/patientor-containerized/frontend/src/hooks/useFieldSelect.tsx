import { SelectChangeEvent } from "@mui/material";
import { useState } from "react"

export const useFieldSelect = <T extends string | number>(type: string, options: Array<{ value: T }>) => {
  const [value, setValue] = useState(options[0].value);

  const onChange = (event: SelectChangeEvent<T>) => {
    // setValue(event.target.value);
    event.preventDefault();
    const newValue = options.find(op => op.value === event.target.value);
    if (newValue) {
      console.log('set new value for select', newValue.value);
      setValue(newValue.value);
    }
  }

  return {
    type,
    value,
    onChange
  }
}