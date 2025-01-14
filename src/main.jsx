import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import SignUp from './Pages/Signup.jsx';
import Login from './Pages/Login.jsx';
import ForgotPassword from './Pages/ForgotPassword.jsx';
import ResetPassword from './Pages/ResetPassword.jsx';
import Home from './Pages/Home.jsx';
import Checklist from './Pages/Checklist.jsx'
import UserProfile from './Pages/UserProfile.jsx';
import NotFound from './Pages/NotFound.jsx';
import Admin from './Pages/Admin.jsx';
import { RecoilRoot } from 'recoil'
import { Toaster } from 'react-hot-toast'
import PostList from './Pages/PostList.jsx'
import PostDetail from './Pages/PostDetail.jsx'
import CreatePost from './Pages/CreatePost.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/profile",
                element: <UserProfile />,
            },
            {
                path: "/docs",
                element: <PostList />
            },
            {
                path: "/docs/:id",
                element: <PostDetail />,
            },
            {
                path: "/createdocs",
                element: <CreatePost />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
            {
                path: "/admin",
                element: <Admin />,
            },
            {
                path: "/checklist",
                element: <Checklist />,
            },
        ],
    },
    {
        path: "/signup",
        element: <SignUp />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/forgotPassword",
        element: <ForgotPassword />,
    },
    {
        path: "/resetPassword/:id/:token",
        element: <ResetPassword />,
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RecoilRoot>
            <RouterProvider router={router} />
            <Toaster />
        </RecoilRoot>
    </StrictMode>
)
