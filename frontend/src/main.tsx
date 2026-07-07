
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from '../store/store.ts'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Dashboard from './components/Dashboard/Dashboard.tsx'
import Search from './components/Search.tsx'
import Detail from './components/Detail.tsx'
import Header from './components/Header/Header.tsx'
import AuthLayout from './components/AuthLayout.tsx'
import Login from './components/Header/Login.tsx'
import Portfolio from './pages/Portfolio.tsx'
import Profile from './pages/Profile.tsx'
const router = createBrowserRouter([
  {
    path: "/" , 
    element : <App/>,
    children : [
      {
        path : "/" , 
        element : 
        <>
        <Header/>
        <Home/>
        </>
      } , 
      {
        path : "/dashboard" , 
        element :<>
        <Header/>
         <Dashboard/>
         </>
      } , 
      {
        path : "/search" , 
        element :<>
        <AuthLayout authentication={true}>
        <Header/>
         <Search/>
         </AuthLayout>
         
         </>
      } , 
      {
        path : "/:id" , 
        element :<>
        <AuthLayout authentication={true}>
         <Header/>
         <Detail/>
         </AuthLayout>
         </>
      } , 
       {
        path : "/login" , 
        element :<>
        <AuthLayout authentication={false}>
         <Header/>
         <Login/>
         </AuthLayout>
         </>
      } , 
      {
        path : "/portfolio" , 
        element :<>
        <AuthLayout authentication={true}>
         <Header/>
         <Portfolio/>
         </AuthLayout>
         </>
      } , 
       {
        path : "/profile" , 
        element :<>
        <AuthLayout authentication={true}>
         <Header/>
         <Profile/>
         </AuthLayout>
         </>
      }
    ]
  }
]);


createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
  <RouterProvider router={router}/>
    </Provider>
)
