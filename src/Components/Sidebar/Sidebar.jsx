import { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, Outlet, Link } from 'react-router-dom';

export function Sidebar({chatsList}) {

    const [ isLoaded, setIsLoaded ] = useState(false);
    const navigate = useNavigate();

    // const [ allChats, setAllChats ] = useState([]);

    // console.log('checking allChats')
    // console.log(allChats)

    useEffect(() => {
        setIsLoaded(true);
    },[])

    // useEffect(() => {
    //     async function fetchData() {
    //         const response = await fetch(`${ import.meta.env.VITE_BACKEND_URL }/home/get_chats_for_user`, {
    //             credentials: "include",
    //         })

    //         if (response.status === 401) navigate('/login');

    //         const data = await response.json();
    //         console.log('checking data for SideBar')
    //         console.log(data)
    //         setAllChats(data.allChats)
    //     }

    //     fetchData()
    // }, [])

    // async function openChat(chat) {
    //     navigate(`chats/${chat.id}`)
    // }
    // to store list of chatLinks
    // should make fetch request to get all chats, perhaps updated by time (most recently accessed at the top)
    // so perhaps each chat should have a lastUpdated field. When making a comment, update this field.
    // requires useState and useEffect frankly
    // perhaps the chat should also have a field for the number of members.
    return (
        !isLoaded ? <p>Loading</p> :

        <>

            <section className={styles.sidebar}>
                <p>It's me, the sidebar</p>

                <section>
                    <button onClick={() => navigate(`create_chat`)}>Create new chat</button>
                </section>


                <p>Chats:</p>

                {
                  // allChats.length === 0 ? 
                  chatsList.length === 0 ? 
                  <p>No chats!</p>
                  :

                <ul>

                {/* {allChats.map(chat => { */}
                {chatsList.map(chat => {
                    return (
                        <li>
                            <Link to={`chats/${chat.id}`}>
                                <section>
                                  <p>{chat.name}</p>
                                  <p>{chat.lastUpdated}</p>
                                  </section>

                            </Link>
                        </li>
                    )
                })}

                </ul>
                }



            </section>
        </>
    )
}