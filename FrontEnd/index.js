import React, { useContext, useEffect, useState ,lazy,Suspense} from "react";
import ReactDom from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
 import { ToastContainer,Bounce} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// React.createElement("div","id:parent","hi iam h1")
import { lazy } from "react";

// Components
const Home = lazy(() => import("./Components/Home.component.js"));
const Contact = lazy(() => import("./Components/Contact.componenet.js"));
const NavBar = lazy(() => import("./Components/NavBar.component.js"));
const Login = lazy(() => import("./Components/Login.component.js"));
const SignUp = lazy(() => import("./Components/SignUp.component.js"));
const Logout = lazy(() => import("./Components/Logout.component.js"));
const Jobs = lazy(() => import("./Components/Jobs.component.js"));
const Profile = lazy(() => import("./Components/Profile.componenet.js"));
const Job_jobcard_details = lazy(() => import("./Components/Job_jobcard_details.component.js"));
const Companies = lazy(() => import("./Components/Admin_components/Companies.admin.component.js"));
const AdminJobs = lazy(() => import("./Components/job_components/AdminJobs.admin.component.js"));
const Createcompany = lazy(() => import("./Components/Admin_components/Createcompany.admin.component.js"));
const CreateCompanyDetails = lazy(() => import("./Components/Admin_components/CreateCompanyDetails.admin.component.js"));
const Createjobpage = lazy(() => import("./Components/job_components/Createjobpage.componenet.js"));
const AppliedJobs_navbar = lazy(() => import("./Components/AppliedJobs_navbar.component.js"));
const Job_user_applications = lazy(() => import("./Components/job_components/Job_user_applications.admin.components.js"));
const SearchResults = lazy(() => import("./Components/SearchResults.home.components.js"));
const About = lazy(() => import("./Components/About.js"));
const ChatComponent = lazy(() => import("./Components/ChatComponent.js"));
const ChatPage = lazy(() => import("./Components/Chat_Admin_page.js"));
import { RotatingLines } from 'react-loader-spinner'
// Utils
// const use_user_info = lazy(() => import("./Utils/use_user_info.utils.js"));
// const appstore = lazy(() => import("./Utils/Store/appstore.js"));
import appstore from "./Utils/Store/appstore.js";
import use_user_info from "./Utils/use_user_info.utils.js";
// / ❌ INVALID (Provider is not a default export — don't use lazy for named imports)
import { Provider } from "react-redux";


const MainContainer=()=>{


// const{user,bio,userdata1}=useContext(use_user_info);
      return (
  <div className="box-border m-0 p-0">
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
 <RotatingLines
    visible={true}
    height="96"
    width="96"
    strokeWidth="5"
    animationDuration="0.5"
    ariaLabel="rotating-lines-loading"
    wrapperClass="custom-loader"
  />

        </div>
      }
    >
      <NavBar />
      <Outlet />
    </Suspense>
  </div>
);
}
const AppLayout=
createBrowserRouter([{
    path:"/",
    element:<MainContainer/>,
    children:[
        {
            path:"/home",
            element:<Home/>,
        },
        {
            path:"/jobs",
            element:<Jobs/>,
        },
      
        {
            path:"/Contact-us",
            element:<Contact/>,
        },{
            path:"/AppliedJobs",
            element:<AppliedJobs_navbar/>
        },
        {
            path:'/Login',
            element:<Login/>
        }, {
            path:"/SignUp",
            element:<SignUp/>
        },
        {
            path:"/logout",
            element:<Logout/>
        },
        {
            path:"/profile",
            element:<Profile/>,

        },
        {
            path:"/Details/:jobid",
            element:<Job_jobcard_details/>
        },
        {

                path:"/SearchResults",
                element:<SearchResults/>
        },
        ,{
            path:"/aboutme",
            element:<About/>
        },
        { path:'/chat/:recruiterId/:status/:userid/:jobapplication_id',
            element:<ChatComponent/>
        },
        ///// for admin components  it starts from here




        {
            path:"/admin/companies",
            element:<Companies/>
        },
        {
            path:"/admin/adminjobs",
            element:<AdminJobs/>
        },
        {
            path:"/admin/create/company",
            element:<Createcompany/>
        },
        {
            path:"/admin/create/companydetails/:compid",
            element:<CreateCompanyDetails/>
        },
        {    path:"/admin/create/newjob",
            element:<Createjobpage/>
        },
        {
            path:'/admin/applicants/:jobid',
            element:<Job_user_applications/>
        
        
        },
        {path:'/chat/:userid',
            element:<ChatPage/>
        }
       
    ]
}, 

])


const root=ReactDom.createRoot(document.querySelector(".root"));


const App=()=>{

 

    return (
        <Provider store={appstore}>
        <div className="h-full w-full m-0 p-0 box-border">
            


 <RouterProvider router={AppLayout}/>
<ToastContainer
position="bottom-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light" />
{/* </use_user_info.Provider> */}
        </div>
        </Provider>
    )
}

root.render(<App/>)