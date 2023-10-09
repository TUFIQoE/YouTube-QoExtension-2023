import {DateTime} from 'luxon'
import {SettingsStorage, VariablesStorage} from '../../../../utils/storage/ChromeStorage'
import {useFormik} from 'formik'
import {number, object, ObjectSchema, string} from 'yup'
import {usePostExperimentMutation} from '../../redux/api/endpoints/experiment'

export interface form {
  subjectAge: number
  subjectSex: 'male' | 'female' | 'undisclosed' | ''
}
const initialForm: form = {
  subjectAge: 18,
  subjectSex: 'male',
}

const FormSchema: ObjectSchema<form> = object({
  subjectSex: string<'male' | 'female' | 'undisclosed'>().required('Subject sex is required'),
  subjectAge: number().typeError('Subject age must be a number').min(1, 'Subject age must be greater than 0').required('Subject age is required'),
})

export const useExperimentStart = () => {
  const [postExperiment, { isLoading: postingExperiment }] = usePostExperimentMutation()

  const handleSubmit = async (values: form) => {
    await postExperiment({
      ...values,
      started: DateTime.now().toISO(),
    })
      .unwrap()
      .then(async (data) => {
        await startExperiment(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const startExperiment = async (experiment: any): Promise<void> => {
    // returns array with scenario for 50 min (5 x 10 min), base on experiment_id
    // (experiment_id % 6, where 6 is amount of permutations os bitrate)
    const bitrateScenario = getBitrateScenario(experiment.id)

    await SettingsStorage.setItem('bitrateScenario', bitrateScenario) // custom scenario
    await SettingsStorage.setItem('bitrateIntervalMs', 6e5) // 10 min
    await SettingsStorage.setItem('experimentDurationMs', 3e6) // 50 min
    await SettingsStorage.setItem('assessmentJitterRangeMs', [0, 0]) // no jitter
    await SettingsStorage.setItem('assessmentTimeoutMs', 15e4) // assessment timeout 2.5 min


    await VariablesStorage.setItem('running', true)
    await VariablesStorage.setItem('experimentID', experiment.id)
    window.location.href = 'https://www.youtube.com/'
  }

  const generatePermutations = (arr: [number, number, number]): [number, number, number][] => {
    const result: [number, number, number][] = [];

    function permute(arr: [number, number, number], startIndex: number) {
      if (startIndex === arr.length - 1) {
        result.push([...arr]); // Clone the array and add it to the result
        return;
      }

      for (let i = startIndex; i < arr.length; i++) {
        // Swap elements at startIndex and i
        [arr[startIndex], arr[i]] = [arr[i], arr[startIndex]];

        // Recursively generate permutations for the remaining elements
        permute(arr, startIndex + 1);

        // Swap elements back to their original positions (backtracking)
        [arr[startIndex], arr[i]] = [arr[i], arr[startIndex]];
      }
    }

    permute(arr, 0);
    return result;
  }

  const getBitrateScenario = (experiment_id: number): [number, number, number, number, number] => {
    const values: [number, number, number] = [375e2, 75e3, 125e3] // bytes per seconds
    const highest_value: number = 125e7

    let scenarios = generatePermutations(values)

    return [highest_value, ...scenarios[experiment_id % 6], highest_value]
  }

  const formik = useFormik({
    initialValues: initialForm,
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  })

  return { formik, postingExperiment }
}
