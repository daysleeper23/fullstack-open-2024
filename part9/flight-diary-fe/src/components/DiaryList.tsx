import DiaryItem from "./DiaryItem";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

import { DiaryEntry } from "../types";

export default function DiaryList({ list }: { list: DiaryEntry[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Diary Entries</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Weather</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map(element => <DiaryItem key={element.id} entry={element} />)}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
