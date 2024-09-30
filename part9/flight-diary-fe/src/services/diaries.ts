import axios from 'axios'
import { DiaryEntry, NewDiaryEntry } from '../types'

const apiPatientsUrl = "http://localhost:3000/api/diaries"

const getAll = async () => {
  const { data } = await axios.get<DiaryEntry[]>(apiPatientsUrl)
  return data;
}

const createOne = async(object: NewDiaryEntry) => {
  const { data } = await axios.post<DiaryEntry>(apiPatientsUrl, object);
  return data;
}

export default { getAll, createOne }