import { Dialog, DialogTitle, DialogContent, Divider, Alert } from '@mui/material';

import AddEntryForm from "./AddEntryForm";
import { Diagnosis, EntryWithoutId } from "../../types";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryWithoutId) => void;
  error?: string;
  diagData: Array<Diagnosis>
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagData }: Props) => (
  <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
    <DialogTitle>Add a new entry</DialogTitle>
    <Divider />
    <DialogContent>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnoses={diagData}/>
    </DialogContent>
  </Dialog>
);

export default AddEntryModal
