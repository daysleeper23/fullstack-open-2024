import { Diagnosis, EntryHospital } from "../../types";

import { Card, Box, Typography, CardContent } from "@mui/material";
import { red } from "@mui/material/colors";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import CardInfo from "./CardInfo";
import SectionDateDescription from "./SectionDateDescription";
import SectionDiagnoses from "./SectionDiagnoses";

const CardEntryHospital = ({ data, diag}: { data: EntryHospital, diag: Array<Diagnosis> }) => {
  return (
    <Card style={{ marginBottom: "1em"}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: red[300], padding: "1em", alignItems: "center" }}>
        <LocalHospitalIcon style={{ marginRight: "0.5em"}}/>
        <Typography variant="h6">
          {data.type}
        </Typography>
      </Box>
      <CardContent>
        <SectionDateDescription date={data.date} desc={data.description} />

        <SectionDiagnoses specialist={data.specialist} diagnosisCodes={data.diagnosisCodes || []} diag={diag} />
  
        <CardInfo title='Discharge' content=''>
          <Typography variant='body2' color='textSecondary'>
            {data.discharge.date} --- {data.discharge?.criteria}
          </Typography>
        </CardInfo>
      </CardContent>
    </Card>
  )
}
export default CardEntryHospital;