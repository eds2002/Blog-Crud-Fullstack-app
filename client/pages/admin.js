import { verify, decode } from "jsonwebtoken"
import { useRouter } from "next/router"
import tw from "tailwind-styled-components/dist/tailwind"
import {Navbar} from '../components'
import {useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExchange, faDeleteLeft, faD } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
const Container = tw.section`
w-[100vw]
relative
z-[909999]
bg-gray-100
`

const Layout = tw.div`
max-w-[1280px]
h-full
mx-auto
px-[15px]
`

const Wrapper = tw.div`
w-full
h-full
relative
`

const Heading = tw.h1`
text-4xl
font-bold
my-[50px]
`

const Filters = tw.div`
flex
gap-x-3
`

const AllBlogs = tw.p`
py-[5px]
px-[25px]
rounded-full
bg-indigo-600
text-white
cursor-pointer
hover:bg-indigo-700
`
const ViewUsers = tw.p`
py-[5px]
px-[25px]
rounded-full
bg-indigo-600
text-white
cursor-pointer
hover:bg-indigo-700
`

const DisplayInformation = tw.div`
w-full
h-[500px]
overflow-scroll
rounded-lg
bg-gray-200
mt-[25px]
mb-[50px]
grid
md:grid-cols-3
sm:grid-cols-2
grid-cols-1
gap-3
p-[25px]
`

const UserCard = tw.div`
bg-gray-300
h-[275px]
rounded-xl
p-[25px]
flex
justify-center
align-center
flex-col
`

const Username = tw.p`
text-center
`

const UserId = tw.p`
text-gray-500
text-center
`

const Name = tw.p`
text-center
text-xl
font-bold
`

const CurrentRole = tw.p`
text-center
my-[20px]
font-bold
flex
items-center
justify-center
gap-x-2
`

const RemoveUser = tw.button`
py-[5px]
px-[20px]
bg-red-500
rounded-lg
text-white
my-[5px]
hover:bg-red-600
transition
flex
justify-center
items-center
gap-x-3
hover:gap-x-2
`

const ChangeRole = tw.button`
py-[5px]
px-[20px]
bg-slate-500
hover:bg-slate-600
rounded-lg
text-white
my-[5px]
flex
justify-center
items-center
gap-x-3
hover:gap-x-2
relative
`

const ConfirmButton = tw.p`
absolute
py-[5px]
px-[20px]
bg-slate-800
hover:bg-slate-600
rounded-lg
text-white
my-[5px]
flex
justify-center
items-center
gap-x-3
hover:gap-x-2
left-0
right-0
`

const Admin = ({allUsers, allBlogs,currentUser,logged}) => {
    const userLogged = currentUser === null ? false : true
    // const [currentFilter, setCurrentFilter] = useState('users')
    const [users, setUsers] = useState(allUsers)
    const [confirmation, setConfirmation] = useState(false)
    const deleteUser = () =>{
        
    }

    const changeUserRole = async (userId,index,role) =>{
        if(role === 'admin'){
            users[index].roles = 'user'
            setUsers([...users])
            await axios.patch(`https://mysqlnodeblogapp.herokuapp.com/user/role/${userId}/user`)
                .then((res)=>{
                })
        }else{
            users[index].roles = 'admin'
            setUsers([...users])
            await axios.patch(`https://mysqlnodeblogapp.herokuapp.com/user/role/${userId}/admin`)
                .then((res)=>{
                })
        }
    }

  return (
    <Container>
        <Navbar signed = {userLogged} user = {currentUser} page = 'admins'/>
        <Layout>
            <Wrapper>
                <Heading>Hi admin, welcome to the dash!</Heading>
                <Filters>
                    <AllBlogs>All Blogs</AllBlogs>
                    <ViewUsers>All Users</ViewUsers>
                </Filters>
                <DisplayInformation className = "scrollbar">
                    {users.map((user,index)=>(
                        <UserCard key = {index}>
                            <UserId>Id: {user.id}</UserId>
                            <Name>{user.first_name +" "+ user.last_name}</Name>
                            <Username>@{user.username}</Username>
                            <CurrentRole>Current Role: <span className = "text-green-600"> {user.roles}</span></CurrentRole>
                            <ChangeRole onClick = {()=>changeUserRole(user.id, index, user.roles)}> 
                                <FontAwesomeIcon icon = {faExchange}></FontAwesomeIcon>
                                Change Role
                            </ChangeRole>
                            <RemoveUser onClick = {()=>deleteUser(user.id, index)}>
                                <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                                Remove User
                            </RemoveUser>
                        </UserCard>
                    ))}
                </DisplayInformation>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default Admin

export async function getServerSideProps(context) {
    const jwt = context.req.cookies.userToken
    verify(jwt, process.env.JWT_SECRET)
    const currentUser = decode(jwt)
    if(currentUser.role === 'admin'){
        // A admin can change what is displayed on the front page, fetch all PUBLISHED blogs to respect privacy
        // A admin can see a assign roles or even change roles

        // Fetching user data
        const allUsersRes = await fetch('https://mysqlnodeblogapp.herokuapp.com/user/all')
        const allUsersData = await allUsersRes.json()

        // Fetching all blogs data
        const allBlogsRes = await fetch('https://mysqlnodeblogapp.herokuapp.com/blog')
        const allBlogsData = await allBlogsRes.json()
        return {props:{allUsers: allUsersData.result, allBlogs: allBlogsData, currentUser:decode(jwt)}}
    }else{
        return {
            redirect: {
              permanent: false,
              destination: "/404",
            },
            props:{},
        };
    }
}