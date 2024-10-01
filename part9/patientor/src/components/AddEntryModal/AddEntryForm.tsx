import { useState, SyntheticEvent } from "react";

import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent } from '@mui/material';

import { EntryWithoutId, HealthCheckRating, EntryType } from "../../types";

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
  const [entryType, setEntryType] = useState('HealthCheck');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [rating, setRating] = useState(0);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const entryTp = Object.values(EntryType).find(g => g.toString() === value);
      if (entryTp) {
        setEntryType(entryTp);
      }
    }
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<number>) => {
    event.preventDefault();
    if ( typeof event.target.value === "number") {
      const value = event.target.value;
      const newRate = ratingOptions.find(rating => rating.value === value);
      if (newRate && newRate.value >= 0) {
        setRating(newRate.value);
      }
    }
  };

  const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();

    switch (entryType) {
      case 'HealthCheck':
        onSubmit({
          type: 'HealthCheck',
          date,
          description,
          specialist,
          healthCheckRating: rating,
          // ,
          // diagnosisCodes: codes
        });
        break;
      case 'Hospital':
        onSubmit({
          type: 'Hospital',
          date,
          description,
          specialist,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          },
          // ,
          // diagnosisCodes: codes
        });
        break;
      case 'OccupationalHealthcare':
        onSubmit({
          type: 'OccupationalHealthcare',
          date,
          description,
          specialist,
          employerName,
          sickLeave: {
            startDate: sickLeaveStart,
            endDate: sickLeaveEnd
          },
          // ,
          // diagnosisCodes: codes
        });
        break;
    }
    
  };

  return (
    <div>
      <form onSubmit={addPatient}>
        <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
        <Select
          label="Entry Type"
          fullWidth
          value={entryType}
          onChange={onEntryTypeChange}
          style={{ marginBottom: "1em"}}
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
        <TextField 
          label="Date" placeholder="YYYY-MM-DD"
          fullWidth style={{ marginBottom: "1em"}}
          value={date} onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Description"
          fullWidth style={{ marginBottom: "1em"}}
          value={description} onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth style={{ marginBottom: "1em"}}
          value={specialist} onChange={({ target }) => setSpecialist(target.value)}
        />
        {entryType === 'HealthCheck' 
          ? <>
              <InputLabel style={{ marginTop: 20 }}>Health Rating</InputLabel>
              <Select
                label="Health Rating"
                fullWidth style={{ marginBottom: "1em"}}
                value={rating}
                onChange={onHealthCheckRatingChange}
                
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
          : entryType === 'Hospital'
              ? <>
                  <TextField
                    label="Discharge date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={dischargeDate}
                    onChange={({ target }) => setDischargeDate(target.value)}
                    style={{ marginBottom: "1em"}}
                  />
                  <TextField
                    label="Discharge criteria"
                    fullWidth
                    value={dischargeCriteria}
                    onChange={({ target }) => setDischargeCriteria(target.value)}
                    style={{ marginBottom: "1em"}}
                  />
                </>
              : <>
                  <TextField
                    label="Employer name"
                    fullWidth
                    value={employerName}
                    onChange={({ target }) => setEmployerName(target.value)}
                    style={{ marginBottom: "1em"}}
                  />
                  <TextField
                    label="Start date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={sickLeaveStart}
                    onChange={({ target }) => setSickLeaveStart(target.value)}
                    style={{ marginBottom: "1em"}}
                  />
                  <TextField
                    label="End date"
                    placeholder="YYYY-MM-DD"
                    fullWidth
                    value={sickLeaveEnd}
                    onChange={({ target }) => setSickLeaveEnd(target.value)}
                    style={{ marginBottom: "1em"}}
                  />
                </>
          };    

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