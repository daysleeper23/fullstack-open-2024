import { SelectChangeEvent } from "@mui/material";
import { useState } from "react"

export const useFieldSelect = (type: any, options: Array<{ value: any }>) => {
  const [value, setValue] = useState(options[0].value);

  const onChange = (event: SelectChangeEvent<any>) => {
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