import diagnosesData from '../data/diagnoses'
import { Diagnose } from '../types'

const diagnoses: Diagnose[] = diagnosesData;

const getDiagnoses = (): Diagnose[] => {
  return diagnoses
}

const addDiagnose = (diag: Diagnose) => {
  return diag
}

export default {
  getDiagnoses,
  addDiagnose
}