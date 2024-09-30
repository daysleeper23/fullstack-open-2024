import { TableCell, TableRow } from "./ui/table"
import { DiaryEntry } from "../types"

export default function DiaryItem({ entry } : { entry: DiaryEntry }) {
  return (
    <TableRow>
      <TableCell className="text-l font-bold">{entry.date}</TableCell>
      <TableCell>{entry.visibility}</TableCell>
      <TableCell>{entry.weather}</TableCell>
    </TableRow>
  )
}
