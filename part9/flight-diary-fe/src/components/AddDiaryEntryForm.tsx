import { Visibility, Weather } from "../types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import diaryService from '../services/diaries'
import { useState } from "react";
import { z } from "zod";
import AlertError from "./AlertError";
import { AxiosError } from "axios";

const FormSchema = z.object({
  date: z.string({
      required_error: "Please provide the date of the flight entry.",
    })
    .date(),
  visibility: z.nativeEnum(Visibility),
  weather: z.nativeEnum(Weather),
  comment: z.string().optional()
})

interface AddDiaryEntryFormProps {
  onCreateNew: (value: boolean) => void;
}

export default function AddDiaryEntryForm({ onCreateNew }: AddDiaryEntryFormProps) {
  const [date, setDate] = useState<string>('')
  const [visibility, setVisibility] = useState('')
  const [weather, setWeather] = useState('')
  const [comment, setComment] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  const addEntry = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    try {
      const newEntry = FormSchema.parse({
        date,
        visibility,
        weather,
        comment
      })
      console.log('new entry', newEntry)
      await diaryService.createOne(newEntry)
      clearFormData(event)
      onCreateNew(true)
    }
    catch(error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message)
      }

      if (error instanceof AxiosError) {
        console.log('axios', error)
      }
    }    
  }

  const clearFormData = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setDate('')
    setVisibility('')
    setWeather('')
    setComment('')
  }

  return (
    <>
      {error
        ? <AlertError description={error}/>
        : <></>
      }
      <form>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Add new entry</CardTitle>
            <CardDescription>Add new entry to your flight diaries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Date</Label>
                <Input id="name" placeholder="The date of your flight" value={date} onChange={(e) => setDate(e.target.value)}/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Visibility</Label>
                <Select value={visibility} onValueChange={(value) => setVisibility(value as Visibility)}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {Object.values(Visibility).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="framework">Weather</Label>
                <Select value={weather} onValueChange={(value) => setWeather(value as Weather)}>
                  <SelectTrigger id="framework">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {Object.values(Weather).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="comment">Comment</Label>
                <Input id="comment" placeholder="Any comments?" value={comment} onChange={(e) => setComment(e.target.value)}/>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={clearFormData}>Clear data</Button>
            <Button type="submit" onClick={addEntry}>Add</Button>
          </CardFooter>
        </Card>
      </form>
    </>
  )
}

