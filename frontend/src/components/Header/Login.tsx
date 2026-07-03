import authService from "../../services/auth"

function Login() {
  return (

    <>
    <p>Sign in to access features</p>
    <button onClick={()=>{
      authService.loginWithGoogle();
    }}>Login with Google</button>
    </>
  )
}

export default Login