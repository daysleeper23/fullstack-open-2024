import { SyntheticEvent, useState } from "react";
import {  TextField, InputLabel, MenuItem, Select, Grid, Button, Input, OutlinedInput, Box, Chip, SelectChangeEvent, Theme, useTheme } from '@mui/material';
import { EntryWithoutId, HealthCheckRating, EntryType, Diagnosis } from "../../types";
import  { useField } from '../../hooks/useField'
import { useFieldSelect } from "../../hooks/useFieldSelect";


interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  diagnoses: Array<Diagnosis>;
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}


const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
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

  const theme = useTheme();
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const onSelectDiagnosisCode = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    switch (entryType.value) {
      case 'HealthCheck':
        // console.log('go to HC', entryType.value, date.value)
        // return;
        onSubmit({
          type: 'HealthCheck',
          date: date.value,
          description: description.value,
          specialist: specialist.value,
          healthCheckRating: rating.value,
          diagnosisCodes: diagnosisCodes
        });
        break;
      case 'Hospital':
        console.log('go to H', entryType.value, dischargeDate.value)
        onSubmit({
          type: 'Hospital',
          date: date.value,
          description: description.value,
          specialist: specialist.value,
          discharge: {
            date: dischargeDate.value,
            criteria: dischargeCriteria.value
          },
          diagnosisCodes: diagnosisCodes
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
          diagnosisCodes: diagnosisCodes
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
        <TextField required variant="standard" label="Description" fullWidth style={{ marginBottom: "1em"}}
          {...description}
        />
        <TextField required variant="standard" label="Specialist" fullWidth style={{ marginBottom: "1em"}}
          {...specialist}
        />

        <InputLabel id="multiple-chip-label" style={{ marginTop: "1em", marginBottom: "0.5em" }}>Diagnoses</InputLabel>
        <Select
          labelId="multiple-chip-label" id="multiple-chip"
          multiple fullWidth variant="standard"
          value={diagnosisCodes} onChange={onSelectDiagnosisCode}
          input={<OutlinedInput id="select-multiple-chip" label="Diagnoses" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {diagnoses.map((diagnosis) => (
            <MenuItem
              key={diagnosis.code}
              value={diagnosis.code}
              style={getStyles(diagnosis.code, diagnosisCodes, theme)}
            >
              {diagnosis.code}
            </MenuItem>
          ))}
        </Select>

        {entryType.value === 'HealthCheck' 
          ? <>
              <InputLabel style={{ marginTop: "1em", marginBottom: "0.5em" }}>Health Rating</InputLabel>
              <Select label="Health Rating" fullWidth style={{ marginBottom: "1em"}}
                {...rating}                
              >
                {ratingOptions.map(option =>
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                )}
                </Select>
            </>
          : entryType.value === 'Hospital'
              ? <>
                  <InputLabel style={{ marginTop: "2em", marginBottom: "1em" }}>Discharge Information</InputLabel>
                  <Input required fullWidth style={{ marginBottom: "0.5em" }} {...dischargeDate} />
                  <TextField required variant="standard" label="Criteria" fullWidth style={{ marginBottom: "1em"}}
                    {...dischargeCriteria}
                  />
                </>
              : <>
                  <TextField required variant="standard" label="Employer name" style={{ marginTop: "1em", marginBottom: "1em"}} fullWidth
                    {...employerName}
                  />

                  <InputLabel style={{ marginTop: "1em", marginBottom: "1em" }}>Sick Leave</InputLabel>
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

        <Grid style={{ marginTop: "2em", paddingBottom: "1em" }}>
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
