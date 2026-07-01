import authService from "../../services/auth"

function Login() {
  return (
    <button onClick={()=>{
      authService.loginWithGoogle();
    }}>Login with Google</button>
  )
}

export default Login