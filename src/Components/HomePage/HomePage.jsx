import styles from './HomePage.module.css'
import { fetchData } from '../../helper/helperFunctions'

import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

import { Sidebar } from "../Sidebar/Sidebar"
import { Header } from "../Header/Header"

export function HomePage() {

  const navigate = useNavigate();
  const [ chatsList, setChatsList ] = useState([]);
  const [ updateChatsList, setUpdateChatsList ] = useState(true)
  const [ loggedInUser, setLoggedInUser ] = useState({});
    // create fetch request for req.user. 
    // useEffect(() => {
    //     fetch(`${ import.meta.env.VITE_BACKEND_URL }`)
    // })
    // create fetch request for req.isAuthenticated. If not, then redirect. Perhaps add this to the route beforehand.
    // needs a check for user authorization. Redirect to login page if not logged in.
    // requires state logic to see if logged in. Perhaps on this component, or the parent component (PageLayout)
    // HomePage contains Sidebar.
    // contains chatWrapper and userProfileWrapper

    // Will need to add an "Add friend" component and "users online" button.

    useEffect(() => {

      async function fetchChats() {
        const response = await fetchData(`home/get_chats_for_user`, "GET")
        if (response.status === 401) navigate('/login');
        const fetchedData = await response.json();
        setChatsList(fetchedData.allChats)
        setUpdateChatsList(false)
      }

      async function fetchLoggedInUserData() {
        const response = await fetchData(`home/get_logged_in_user`, "GET")
        const fetchedData = await response.json();
      }

      if(updateChatsList) fetchChats()

    }, [updateChatsList])

    return (
        <>
        <main className={styles.homePage}>
            < Header />
            <section className={styles.belowHeader}>
                < Sidebar chatsList={chatsList} />
                < Outlet context={[ setUpdateChatsList ]} />
            </section>
        </main>


        </>
    )
}