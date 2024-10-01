import { Diagnosis, EntryOccupationalHealthcare } from "../../types";

import { Card, Box, Typography, CardContent, List, ListItem, ListItemText } from "@mui/material";
import { purple, blue } from "@mui/material/colors";
import WorkIcon from '@mui/icons-material/Work';

import CardInfo from "./CardInfo";
import SectionDateDescription from "./SectionDateDescription";
import SectionDiagnoses from "./SectionDiagnoses";

const CardEntryOccupationalHealthcare = ({ data, diag}: { data: EntryOccupationalHealthcare, diag: Array<Diagnosis> }) => {
  return (
    <Card style={{ marginBottom: "1em"}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: purple[300], padding: "1em", alignItems: "center" }}>
        <WorkIcon style={{ marginRight: "0.5em"}}/>
        <Typography variant="h6">
          {data.type}
        </Typography>
      </Box>

      <CardContent>
        <SectionDateDescription date={data.date} desc={data.description} />

        <Box sx={{ display: 'flex', gap: '1em', flexDirection: 'row', alignItems: "top" }}>
          <Box sx={{ flexGrow: 1 }}>
            <CardInfo title='Employer name' content={data.employerName} />
          </Box>
          <Box sx={{ flexGrow: 3 }}>
            <CardInfo title='Sick leave' content={data.description}>
              {data.sickLeave 
                ? <Typography variant='body2' color='textSecondary'>{data.sickLeave.startDate} {` → `}  {data.sickLeave.endDate}</Typography>
                : <Typography variant='body2' color='textSecondary'>No sick leave</Typography>
              }
            </CardInfo>
          </Box>
        </Box>
        
        <SectionDiagnoses specialist={data.specialist} diagnosisCodes={data.diagnosisCodes || []} diag={diag} />
      </CardContent>
    </Card>
  )
}
export default CardEntryOccupationalHealthcare;