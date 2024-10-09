import Grid from '@mui/material/Grid';
import CardInfo from "./CardInfo"

const SectionDateDescription = ({ date, desc }: { date: string, desc: string }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <CardInfo title='Date' content={date} />
      </Grid>
      <Grid item xs={9}>
        <CardInfo title='Description' content={desc} />
      </Grid>
    </Grid> 
  )
}

export default SectionDateDescription
