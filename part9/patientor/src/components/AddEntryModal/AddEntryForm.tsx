import { SyntheticEvent } from "react";
import {  TextField, InputLabel, MenuItem, Select, Grid, Button, Input } from '@mui/material';
import { EntryWithoutId, HealthCheckRating, EntryType } from "../../types";
import  { useField } from './useField'
import { useFieldSelect } from "./useFieldSelect";


interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
}

interface EntryOptions{
  value: EntryType;
  label: string;
}

const entryOptions: EntryOptions[] = Object.values(EntryType).map(v => ({
  value: v, label: v.toString()
}));

interface HealthCheckOptions{
  value: HealthCheckRating;
  label: string;
}

const ratingOptions: HealthCheckOptions[] = 
  Object.keys(HealthCheckRating)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      value: HealthCheckRating[key as keyof typeof HealthCheckRating], 
      label: key
    })
  );

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const entryType = useFieldSelect('text', entryOptions);
  const rating = useFieldSelect('number', ratingOptions);
  const date = useField('date');
  const description = useField('');
  const specialist = useField('');
  const dischargeDate = useField('date');
  const dischargeCriteria = useField('');
  const employerName = useField('');
  const sickLeaveStart = useField('date');
  const sickLeaveEnd = useField('date');

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    switch (entryType.value) {
      case 'HealthCheck':
        console.log('go to HC', entryType.value)
        onSubmit({
          type: 'HealthCheck',
          date: date.value,
          description: description.value,
          specialist: specialist.value,
          healthCheckRating: rating.value,
          // ,
          // diagnosisCodes: codes
        });
        break;
      case 'Hospital':
        console.log('go to H', entryType.value)
        onSubmit({
          type: 'Hospital',
          date: date.value,
          description: description.value,
          specialist: specialist.value,
          discharge: {
            date: dischargeDate.value,
            criteria: dischargeCriteria.value
          },
          // ,
          // diagnosisCodes: codes
        });
        break;
      case 'OccupationalHealthcare':
        console.log('go to OH', entryType.value)
        onSubmit({
          type: 'OccupationalHealthcare',
          date: date.value,
          description: description.value,
          specialist: specialist.value,
          employerName: employerName.value,
          sickLeave: {
            startDate: sickLeaveStart.value,
            endDate: sickLeaveEnd.value
          },
          // ,
          // diagnosisCodes: codes
        });
        break;
    }
    
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <InputLabel style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>Type</InputLabel>
        <Select label="Entry Type" fullWidth style={{ marginBottom: "1em"}}
          {...entryType}
        >
          {entryOptions.map(option =>
            <MenuItem
              key={option.label}
              value={option.value}
            >
              {option.label
            }</MenuItem>
          )}
        </Select>

        <InputLabel style={{ marginTop: "2em", marginBottom: "1em" }}>Details</InputLabel>

        <Input required fullWidth placeholder="Date" style={{ marginBottom: "0.5em" }} {...date} />
        <TextField variant="standard" label="Description" fullWidth style={{ marginBottom: "1em"}}
          {...description}
        />
        <TextField variant="standard" label="Specialist" fullWidth style={{ marginBottom: "1em"}}
          {...specialist}
        />
        {entryType.value === 'HealthCheck' 
          ? <>
              <InputLabel style={{ marginTop: "1em", marginBottom: "0.5em" }}>Health Rating</InputLabel>
              <Select label="Health Rating" fullWidth style={{ marginBottom: "1em"}}
                {...rating}                
              >
                {ratingOptions.map(option =>
                  <MenuItem
                    key={option.label}
                    value={option.value}
                  >
                    {option.label
                  }</MenuItem>
                )}
                </Select>
            </>
          : entryType.value === 'Hospital'
              ? <>
                  <InputLabel style={{ marginTop: "2em", marginBottom: "1em" }}>Discharge Information</InputLabel>
                  <Input fullWidth style={{ marginBottom: "0.5em" }} {...dischargeDate} />
                  <TextField variant="standard" label="Criteria" fullWidth style={{ marginBottom: "1em"}}
                    {...dischargeCriteria}
                  />
                </>
              : <>
                  <TextField variant="standard" label="Employer name" style={{ marginBottom: "1em"}} fullWidth
                    {...employerName}
                  />

                  <InputLabel style={{ marginTop: "2em", marginBottom: "1em" }}>Sick Leave</InputLabel>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Input fullWidth style={{ marginBottom: "0.5em" }} {...sickLeaveStart} />
                    </Grid>
                    <Grid item xs={6}>
                      <Input fullWidth style={{ marginBottom: "0.5em" }} {...sickLeaveEnd} />
                    </Grid>
                  </Grid>
                </>
          }

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
