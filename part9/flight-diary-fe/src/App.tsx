import { useEffect, useState } from 'react'
import DiaryList from './components/DiaryList'
import AddDiaryEntryForm from './components/AddDiaryEntryForm'
import diaryService from './services/diaries'
import { DiaryEntry } from './types'

// const fetcher = (url: string | URL | Request) => fetch(url).then((res) => res.json());

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [newEntry, setNewEntry] = useState<boolean>(false)

  // const { data, error, isLoading } = useSWR(
  //   "http://localhost:3000/api/diaries",
  //   fetcher
  // );
  useEffect(() => {
    async function fetchDiaries() {
      const diaries = await diaryService.getAll()
      setEntries(diaries)
    }
    fetchDiaries()
  }, [newEntry])

  // if (error) return "An error has occurred.";
  // if (isLoading) return "Loading...";

  return (
    <div className="max-w-screen-xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <AddDiaryEntryForm onCreateNew={setNewEntry}/>
      <DiaryList list={entries} />
    </div>
  )
}

export default App
