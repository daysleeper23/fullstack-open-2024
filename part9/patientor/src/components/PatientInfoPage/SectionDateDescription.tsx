import { Box } from "@mui/material"
import CardInfo from "./CardInfo"

const SectionDateDescription = ({ date, desc }: { date: string, desc: string }) => {
  return (
    <Box sx={{ display: 'flex', gap: '1em', flexDirection: 'row', alignItems: "center" }}>
      <Box sx={{ flexGrow: 1 }}>
        <CardInfo title='Date' content={date} />
      </Box>
      <Box sx={{ flexGrow: 3 }}>
        <CardInfo title='Description' content={desc} />
      </Box>
    </Box>
  )
}

export default SectionDateDescription
