import { Box, TextField, Button, Alert,Typography } from '@mui/material';
import { useState } from 'react';
import { useChangeUserPasswordMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorageService';
import { useSelector } from 'react-redux';

const ChangePassword = () => {
  const [serverError,setServerError]=useState({})
  const [serverMsg, setServerMsg] = useState({})
  const [changeUserPassword] = useChangeUserPasswordMutation()
  const { access_token } = getToken()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      password: data.get('password'),
      password2: data.get('password2'),
    }
    const res = await changeUserPassword({ actualData, access_token })
    if (res.error) {
      setServerMsg({})
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(res.data)
      setServerError({})
      setServerMsg(res.data)
      document.getElementById("password-change-form").reset();
    }

  };
  const myData = useSelector(state => state.user)
  return <>
    <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: 600, mx: 4 }}>
      <h1>Change Password</h1>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }} id="password-change-form">
        <TextField margin="normal" required fullWidth name="password" label="New Password" type="password" id="password" />
      {serverError.password ? <Typography style={{ color: 'red' ,fontSize: '12px',paddingLeft:10}}>{serverError.password[0]}</Typography> : "" }
        
        <TextField margin="normal" required fullWidth name="password2" label="Confirm New Password" type="password" id="password2" />
      {serverError.password2 ? <Typography style={{ color: 'red' ,fontSize: '12px',paddingLeft:10}}>{serverError.password2[0]}</Typography> : "" }
        
        <Box textAlign='center'>
          <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, px: 5 }}> Update </Button>
        </Box>
      </Box>
      {serverError.non_field_errors ? <Alert severity="error">{serverError.non_field_errors[0]}</Alert> : "" }
      {serverMsg.msg ? <Alert severity='success'>{serverMsg.msg}</Alert> : ''}

    </Box>
  </>;
};

export default ChangePassword;



