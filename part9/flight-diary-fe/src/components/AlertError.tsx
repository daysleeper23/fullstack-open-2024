import { Alert, AlertTitle, AlertDescription } from "./ui/alert"

export default function AlertError({ description }: { description: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>

  )
}