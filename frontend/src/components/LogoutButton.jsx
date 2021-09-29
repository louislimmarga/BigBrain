import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

function LogoutButton () {
  const history = useHistory();
  const [logout, setlogout] = React.useState(false);

  // const [token, setToken] = useState(localStorage.getItem('token'))
  const logoutButton = () => {
    const token = localStorage.getItem('token')
    localStorage.setItem('token', '')
    fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'applicaton/json',
        'Content-Type': 'application/json'
      }
    }).then((data) => {
      if (data.status === 200) {
        data.json().then(res => {
          setlogout(true);
        })
      } else {
        data.json().then(res => {
          alert(res.error);
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  React.useEffect(() => {
    if (logout) {
      history.push('/');
    }
  }, [logout])

  return (
    <Button variant="outlined" color="primary" onClick={logoutButton}>Logout</Button>
  )
}

export default LogoutButton
