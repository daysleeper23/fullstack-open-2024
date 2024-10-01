import { Box, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from "@mui/material"
import CardInfo from "./CardInfo"
import { Diagnosis } from "../../types"
import { blue } from "@mui/material/colors"

const SectionDiagnoses = ({ 
  specialist, 
  diagnosisCodes, 
  diag 
}: 
{ specialist: string, 
  diagnosisCodes: Array<Diagnosis['code']>, 
  diag: Array<Diagnosis> 
}) => {

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <CardInfo title='Diagnosed by:' content={specialist} />
      </Grid>
      <Grid item xs={9}>
        <Card 
          sx={{
            '& .MuiCardContent-root:last-child': {
              paddingBottom: '1em',
            }, flexGrow: 1
          }} variant='outlined' style={{ marginBottom: "1em" }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: blue[50], padding: "1em", alignItems: "center" }}>
            <Typography variant="subtitle1">
              Diagnoses:
            </Typography>
          </Box>
          <CardContent>
            <List disablePadding style={{ marginBottom: "1em" }}>
              {diagnosisCodes 
                ? diagnosisCodes.map(c => {
                    const dName = diag.find(d => d.code === c)?.name || ''
                    return (
                      <ListItem key={c} color="textSecondary">
                        <ListItemText primary={c + ' - ' + dName} />
                      </ListItem>
                    )
                  }) 
                : <></>
              }
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SectionDiagnoses
