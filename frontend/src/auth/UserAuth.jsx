import React,{useContext} from 'react'
import {UserContext} from '../context/user.context'
import {useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'


const UserAuth = ({children}) => {
    const {user} = useContext(UserContext)
    const[loading,setLoading] = useState(true)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()



    useEffect(() =>{
        if(!token) {
            navigate('/login')
        }

        if(!user) {
            navigate('/login')
        }
    },[])

  return (
    <>
    {children}
    </>
  )
}

export default UserAuth