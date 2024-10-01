import { Card, CardContent, Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";

const CardInfo = ({ title, content, children }: { title: string, content: string, children?: React.ReactNode }) => {
  return (
    <Card sx={{
        '& .MuiCardContent-root:last-child': {
          paddingBottom: '1em',
        }, flexGrow: 1
      }} variant='outlined' style={{ marginBottom: "1em" }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: blue[50], padding: "1em", alignItems: "center" }}>
        <Typography variant="subtitle1">
          {title}
        </Typography>
      </Box>
      <CardContent>
        {children 
          ? children 
          : <Typography variant="body2" color='textSecondary'>
              {content}
            </Typography>
        }
      </CardContent>
    </Card>
  )
}
export default CardInfo;