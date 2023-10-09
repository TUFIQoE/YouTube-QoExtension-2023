import { style } from './style'
import React, { useEffect } from 'react'
import { Button, TextField, InputLabel, Select, MenuItem } from '@mui/material'
import { useExperimentStart } from './useExperimentStart'
import { redirect } from 'react-router'
import { useNavigate } from 'react-router'
import { Container } from '@mui/material'
import { Box, Alert } from '@mui/material'

import { useGetNextExperimentIDQuery } from '../../redux/api/endpoints/experiment'

const Setup = () => {
  const { formik, postingExperiment } = useExperimentStart()
  const navigate = useNavigate()
  const { data, error, isLoading } = useGetNextExperimentIDQuery(null)

  return (
    <Container
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
      }}
    >
      <Box sx={{ width: 0.5 }} marginTop={'3em'}>
        <h1 style={style.header}>Your YouTube Our Lab Experiment</h1>

        <Box marginY={'2em'} display={'flex'} flexDirection={'column'} gap={'10px'}>
          <Box>
            <InputLabel style={{ color: 'white' }}>Subject Age</InputLabel>
            <TextField size='small' sx={{ width: '100%' }} value={formik.values.subjectAge} onChange={formik.handleChange('subjectAge')} />
          </Box>
          <Box>
            <InputLabel style={{ color: 'white' }}> Subject Sex</InputLabel>
            <Select size='small' sx={{ width: '100%' }} value={formik.values.subjectSex} onChange={(event) => formik.setFieldValue('subjectSex', event.target.value)} variant='outlined'>
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
              <MenuItem value='undisclosed'>Prefer not to say</MenuItem>
            </Select>
          </Box>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={'10px'}>
          <Box>
            {error ? (
              <Alert severity='error'>Error fetching experiment ID. Check server connection.</Alert>
            ) : (
              <>
                <InputLabel sx={{ color: 'white' }}>Experiment ID</InputLabel>
                <TextField disabled value={data ? data.nextExperimentID : 'Loading...'} size='small' sx={{ width: '100%' }} />
              </>
            )}
          </Box>
          {Object.values(formik.errors).length > 0 ? (
            <Alert severity='error'>{Object.values(formik.errors)[0]}</Alert>
          ) : postingExperiment ? null : (
            <Button variant='outlined' size='medium' disabled={error != null} onClick={() => formik.handleSubmit()}>
              Start experiment
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  )
}
export default Setup
