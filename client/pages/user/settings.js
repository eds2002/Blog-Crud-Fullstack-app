import { decode, verify } from "jsonwebtoken"
import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar } from "../../components"
import {useState, useEffect} from 'react'
import axios from "axios"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons"
const Container = tw.section`
w-[100vw]
h-[100vh]
`

const Layout = tw.div`
max-w-[1280px]
h-full
mx-auto
p-[15px]
`

const Wrapper = tw.div`
w-full
h-full
`
const UserTop = tw.div`
bg-indigo-200/50
w-full
rounded-xl
p-[25px]
flex
justify-between
`
const UserTopWrapper = tw.div`

`
const UserTopHeading = tw.h1`
font-bold
text-2xl
`
const UserTopEmail = tw.p`
text-gray-500
text-xs
`
const UserTopViewProfile = tw.button`
bg-indigo-600
rounded-lg
px-[20px]
text-white
hover:bg-indigo-700
`
const Settings = tw.div`
w-full
my-[50px]
flex
flex-col
gap-y-10
`
const SettingsBox = tw.div`
flex
flex-col
gap-y-10
`
const SettingsPassHeader = tw.h1`
font-bold
text-xl
mt-[20px]
`
const SettingsPassDescription = tw.p`
text-[15px]
mb-[10px]
text-gray-500
`
const CurrentPassword = tw.input`
rounded-lg
border-2
border-gray-500
bg-transparent
px-[5px]
py-[10px]
outline-none
md:ml-auto
md:self-end
`
const Username = tw.input`
rounded-lg
border-2
border-gray-500
bg-transparent
px-[5px]
py-[10px]
`
const NameWrapper = tw.div`
flex
gap-x-3
justify-center
`
const FirstName = tw.input`
rounded-lg
border-2
border-gray-500
bg-transparent
px-[5px]
py-[10px]
md:ml-auto
md:self-end
`
const LastName = tw.input`
rounded-lg
border-2
border-gray-500
bg-transparent
px-[5px]
py-[10px]
md:ml-auto
md:self-end
`
const DeleteAccount = tw.button`
w-full
bg-red-500
text-white
mt-[15px]
py-[15px]
rounded-lg
hover:bg-red-600
active:bg-red-700
`

const UsernameHeading = tw.h1`
font-bold
text-xl
`
const NameHeading = tw.h1`
font-bold
text-xl
mt-[25px]
h-full
`

const SettingsWrapper = tw.div`
flex
flex-col
md:flex-row
md:items-center
md:justify-between
`

const PassTextWrapper = tw.div`
flex
items-start
justify-center
flex-col
`

const ButtonsWrapper = tw.div`
md:w-[50%]
flex
gap-x-3
ml-auto
`

const SaveChanges = tw.button`
w-full
bg-indigo-600
text-white
mt-[15px]
py-[15px]
rounded-lg
hover:bg-indigo-700
active:bg-indigo-800
disabled:bg-gray-500
disabled:text-gray-300
px-[15px]
`

const UsernameError = tw.span`
text-xs
${(p)=> p.error === "true" ? "text-red-500":"text-green-500"}
`

const FlexCol = tw.div`
flex
flex-col
`

const FlexRow = tw.div`
w-full
flex
items-center
justify-between
`

const DeleteConfirmation = tw.div`
fixed
top-0
bottom-0
right-0
left-0
bg-black/50
z-[999999999999999999999999999999999]
flex
justify-center
items-center
`
const DeleteConfirmationWrapper = tw.div`
max-w-[500px]
w-full
bg-white
p-[25px]
mx-[15px]
rounded-lg
flex
justify-center
items-center
h-[225px]
flex-col
`
const DeleteHeading = tw.h1`
font-bold
text-xl
text-center
`
const DeleteButton = tw.button`
bg-red-500
py-[10px]
px-[20px]
text-white
rounded-lg
flex
items-center
justify-center
gap-x-3
mt-[30px]
border-2
border-red-500
hover:bg-red-600
active:bg-transparent
active:text-red-500
`



const UserSettings = ({currentUser}) => {
    const router = useRouter();

    const [user, setUser] = useState({});
    const [logged, setLogged] = useState(false);
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [username, setUsername] = useState()
    const [userChanges, setUserChanges] = useState(false)
    const [usernameTaken, setUsernameTaken] = useState(null)
    const [delModal, setDelModal] = useState(false)
    useEffect(()=>{
        let userJWT = localStorage.getItem('accessToken')
        if(verify(userJWT, process.env.JWT_SECRET)){
        setUser(decode(userJWT))
        setLogged(true)
        }else{
            router.push('/404')
        }
        const fetchData = async () =>{
            let currentUser = decode(localStorage.getItem('accessToken'))
            const profileUserRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/user/profile/${currentUser.id}`)
            const profileUserData = await profileUserRes.json()
            console.log(profileUserData.result)
            setFirstName(profileUserData.result[0].first_name)
            setLastName(profileUserData.result[0].last_name)
            setUsername(profileUserData.result[0].username)
        }
        fetchData()
    },[])



    const handleFNameChange = (e)=>{
        if(firstName === e.target.value){
            return
        }
        setUserChanges(true)
        setFirstName(e.target.value)
    }

    const handleLNameChange = (e)=>{
        if(LastName === e.target.value){
            return
        }
        setUserChanges(true)
        setLastName(e.target.value)
    }


    const handleUsername = () =>{
        setUserChanges(true)
    }

    axios.get(`https://mysqlnodeblogapp.herokuapp.com/user/username/${username}`)
    .then((res)=>{
        if(res.data.result.length === 0){
            setUsernameTaken(false)
        }else{
            setUsernameTaken(true)
        }
    })

    const updateSettings = (e)=>{
        if(firstName === '' || lastName === '' || username === ''){
            return 
        }
        axios.patch(`https://mysqlnodeblogapp.herokuapp.com/user/settings/${firstName}/${lastName}/${username}/${user.id}`)
            .then((res)=>{
                router.reload()
        })
    }

    const takeToProfile = () =>{
        router.push(`/profile/${user.id}`)
    }

    const handleUserDelete = (userId) =>{
        axios.delete(`https://mysqlnodeblogapp.herokuapp.com/user/delete/${userId}`)
            .then(()=>{
                localStorage.clear()
                router.push('/')
            })
    }

  return (
    <Container>
        <Navbar user = {user} signed = {logged}/>
        <Layout>
            <Wrapper>
                <UserTop>
                    <UserTopWrapper>
                        <UserTopHeading>Settings</UserTopHeading>
                        {/* <UserTopEmail></UserTopEmail> */}
                    </UserTopWrapper>
                    <UserTopViewProfile onClick = {()=>takeToProfile()}>
                        View Profile
                    </UserTopViewProfile>
                </UserTop>
                <Settings>
                        <FlexRow>
                            <UsernameHeading>Username</UsernameHeading>
                            <FlexCol>
                                <Username value = {username} onChange = {event => setUsername(event.target.value)} onKeyDown = {handleUsername}/>
                                {usernameTaken ? 
                                    <UsernameError error = "true">Username already exists!</UsernameError>
                                :
                                    <UsernameError error = "false">Username is available</UsernameError>
                                }
                            </FlexCol>
                        </FlexRow>
                        <SettingsWrapper>
                            <NameHeading>Your name</NameHeading>
                            <NameWrapper>
                                <FirstName value = {firstName} onChange = {(e)=>handleFNameChange(e)}/>
                                <LastName value = {lastName} onChange = {(e)=>handleLNameChange(e)}/>
                            </NameWrapper>
                        </SettingsWrapper>
                        <ButtonsWrapper>
                            <SaveChanges disabled={!userChanges} onClick = {()=>updateSettings()}>Save my changes</SaveChanges>
                            <DeleteAccount onClick = {()=>setDelModal(!delModal)}>Delete my account</DeleteAccount>
                        </ButtonsWrapper>
                </Settings>
            </Wrapper>
            {delModal && (
                <DeleteConfirmation>
                    <DeleteConfirmationWrapper> 
                    <DeleteHeading>Are you sure you want to delete your account? All your blogs & blogs will be removed forver.</DeleteHeading>
                    <DeleteButton onClick = {()=>handleUserDelete(user.id)}>
                        <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                            Delete my account
                    </DeleteButton>
                    </DeleteConfirmationWrapper>
                </DeleteConfirmation>
            )}
        </Layout>
    </Container>
  )
}

export default UserSettings

// export async function getServerSideProps(context) {
//     const jwt = context.req.cookies.userToken
//     try{
//         verify(jwt, process.env.JWT_SECRET)
//         const user = decode(jwt)
//         const profileUserRes = await fetch(`http://localhost:4001/user/profile/${user.id}`)
//         const profileUserData = await profileUserRes.json()

//         return {props:{user: profileUserData.result,currentUser: user, logged:true}}
//     }catch(error){
//         return {
//             redirect: {
//                 permanent: false,
//                 destination: "/404"
//             }
//         }
//     }
// }