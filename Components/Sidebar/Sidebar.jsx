import { useEffect } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, Outlet } from 'react-router-dom';

export function Sidebar() {

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`${ import.meta.env.VITE_BACKEND_URL }/home/get_all_chats`, {
                // mode: "cors",
                // not sure if withCredentials is required
                // withCredentials: "true",
                credentials: "include",
            })

            if (response.status === 401) navigate('/login');

            const data = await response.json();
            console.log('checking data')
            console.log(data)
        }

        fetchData()
    }, [])
    // to store list of chatLinks
    // should make fetch request to get all chats, perhaps updated by time (most recently accessed at the top)
    // so perhaps each chat should have a lastUpdated field. When making a comment, update this field.
    // requires useState and useEffect frankly
    // perhaps the chat should also have a field for the number of members.
    return (
        <>
        <p>It's me, the sidebar</p>

        <>
        <section>
            Create new chat
        </section>
        
        </>

        
        </>
    )
}