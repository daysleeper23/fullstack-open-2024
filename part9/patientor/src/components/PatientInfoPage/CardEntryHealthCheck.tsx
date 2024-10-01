import { Diagnosis, EntryHealthCheck } from "../../types";

import { Card, Box, Typography, CardContent, List, ListItem, ListItemText } from "@mui/material";
import { green, blue } from "@mui/material/colors";
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

import CardInfo from "./CardInfo";
import HealthRatingBar from '../HealthRatingBar';
import SectionDateDescription from "./SectionDateDescription";
import SectionDiagnoses from "./SectionDiagnoses";

const CardEntryHealthCheck = ({ data, diag}: { data: EntryHealthCheck, diag: Array<Diagnosis> }) => {
  return (
    <Card style={{ marginBottom: "1em"}}>
      <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: green[300], padding: "1em", alignItems: "center" }}>
        <MonitorHeartIcon style={{ marginRight: "0.5em"}}/>
        <Typography variant="h6">
          {data.type}
        </Typography>
      </Box>  
      <CardContent>
        <SectionDateDescription date={data.date} desc={data.description} />

        <CardInfo title='Healthcheck Rating' content={data.healthCheckRating.toString()} >
          <HealthRatingBar showText={true} rating={data.healthCheckRating} />
        </CardInfo>

        <SectionDiagnoses specialist={data.specialist} diagnosisCodes={data.diagnosisCodes || []} diag={diag} />
      </CardContent>
    </Card>
  )
}
export default CardEntryHealthCheck;