import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAt, faLock } from "@fortawesome/free-solid-svg-icons"
import tw from "tailwind-styled-components/dist/tailwind"
import {verify} from 'jsonwebtoken'
import axios from "axios"
import { Navbar } from "../../components"
import { useRouter } from "next/router"
import {useState,useEffect} from 'react'


const Login = () => {
  const router = useRouter();
  useEffect(()=>{
    let userJWT = localStorage.getItem('accessToken')
    if(userJWT){
      if(verify(userJWT, process.env.JWT_SECRET)){
        router.push('/')
      }
    }
  },[])
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleSubmit = async (e) =>{
    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value
    await axios.post('https://mysqlnodeblogapp.herokuapp.com/user/login',{
      email:email,
      password:password,
    },{withCredentials: true})
    .then((res)=>{
      localStorage.setItem('accessToken', res.data.token)
      router.push('/')
    })
    .catch((error)=>{
      switch(error.response.data.message){
        case 'Email does not exist.':
          setEmailError(!emailError)
          break;
        case 'Incorrect password, try again.':
          setPasswordError(!passwordError)
          break
      }
    })
  }

  const takeToSignup = () =>{
    router.push('/user/signup')
  }

  return (
    <Container>
      <Navbar/>
      <Layout>
        <Heading>Welcome back!</Heading>
        <Subheading>Nice to see you again, ready to write?</Subheading>
        <Form method = "POST" onSubmit = {(e)=>handleSubmit(e)}>
          <InputWrapper>
            <Input placeholder = "Email" type = "email" required autocompelete = "email" error = "false" name = "email"/>
            <InputLabel>
              <FontAwesomeIcon icon = {faAt}></FontAwesomeIcon>
            </InputLabel>
            <EmailInvalid visible = {emailError}>Email does not exist.</EmailInvalid>
          </InputWrapper>
          <InputWrapper>
            <Input placeholder = "Password" type = "password" required autocompelete = "current-password" error = "false" name = "password" />
            <InputLabel>
              <FontAwesomeIcon icon = {faLock}></FontAwesomeIcon>
            </InputLabel>
            <PassInvalid visible = {passwordError}>Incorrect password, try again.</PassInvalid>
          </InputWrapper>
          <Button>Sign me in</Button>
          <SignupSpan onClick = {()=>takeToSignup()}>Don&#39;t have an account? Sign up.</SignupSpan>
        </Form>
      </Layout>
    </Container>
  )
}

export default Login


const Container = tw.section`
w-[100vw]
bg-gray-100
`

const Layout = tw.div`
max-w-[1280px]
h-full
h-[80vh]
mx-auto
px-[15px]
flex
flex-col
items-center
justify-center
`

const Heading = tw.h1`
text-3xl
font-bold
text-center
`
const Subheading = tw.h1`
md:text-xl
text-gray-600
text-center
mb-[20px]
`
const Form = tw.form`
w-[350px]
flex
flex-col
`
const InputWrapper = tw.div`
my-[20px]
relative
group
`
const Input = tw.input`
bg-gray-200
py-[10px]
px-[10px]
outline-none
focus:ring-2
ring-indigo-300
rounded-md
w-full
border-2
invalid:ring-red-500
valid:ring-indigo-600
${(p)=> p.error === "true" ? 'border-red-500':'border-gray-200'}
`
const ForgotPassword = tw.p`
text-indigo-600
text-[15px]
cursor-pointer
hover:text-indigo-700
active:text-indigo-800
valid:ring-indigo-600
`
const Button = tw.button`
py-[10px]
bg-indigo-600
mt-[20px]
mb-[10px]
rounded-md
text-white
hover:bg-indigo-700
active:bg-indigo-800
`
const Wrapper = tw.div`
flex
justify-between
items-center
my-[5px]
`
const Label = tw.label`
text-gray-500
text-[15px]
`
const InputLabel = tw.label`
absolute
right-0
top-[50%]
translate-y-[-50%]
px-[15px]
text-gray-400
group-focus-within:text-indigo-600
`

const CheckBox = tw.input`
bg-red-500
mr-[10px]
`

const EmailInvalid = tw.span`
text-xs
text-red-500
absolute
left-0
bottom-[-20px]
${(p)=> p.visible ? "opacity-1" : "opacity-0 pointer-events-none"}
`

const PassInvalid = tw.span`
text-xs
text-red-500
absolute
left-0
bottom-[-20px]
${(p)=> p.visible ? "opacity-1" : "opacity-0 pointer-events-none"}
`

const SignupSpan = tw.span`
text-xs
text-indigo-600
hover:text-indigo-500
cursor-pointer
`