import tw from 'tailwind-styled-components/dist/tailwind';
import {verify} from 'jsonwebtoken'
import {useState,useEffect} from 'react'
import axios from 'axios';
import { useRouter } from 'next/router'
import {Navbar} from '../../components'
axios.defaults.withCredentials = true

const Signup = () => {
  const router = useRouter()
  useEffect(()=>{
    let userJWT = localStorage.getItem('accessToken')
    if(userJWT){
      if(verify(userJWT, process.env.JWT_SECRET)){
        router.push('/')
      }
    }
  },[])
  const [emailError, setEmailError] = useState(false)

  const [passError, setPassError] = useState(false)

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const firstName = e.target.fName.value
    const lastName = e.target.lName.value
    const email = e.target.email.value
    const password = e.target.password.value
    const confPassword = e.target.confPassword.value
    const username = e.target.username.value

    if(password!=confPassword){
      setPassError(true)
      return;
    }
    setPassError(false)

    await axios.get(`https://mysqlnodeblogapp.herokuapp.com/user/username/${username}`)
      .then((result)=>{
        if(result.data.result.length === 0){
          axios.post('https://mysqlnodeblogapp.herokuapp.com/user/signup',{
          email: email,
          password: password,
          firstName: firstName,
          lastName: lastName,
          username: username,
          darkmode:0,
          showUsername:0,
          roles:'user',
        },{withCredentials: true})
        .then((response)=>{
          setEmailError(false)
          localStorage.setItem('accessToken', response.data.token)
          router.push('/')
        })
        .catch((error)=>{
          console.log(error)
          setEmailError(true)
        })
        }
      })

  }

  return (
    <Container>
      <Navbar/>
      <Layout>
        <Heading>Hi newbie,</Heading>
        <Subheading>Let&#39;s get you started as quick as possible!</Subheading>
        <Form onSubmit = {(e)=>handleSubmit(e)} method = "POST">
          <Wrapper>
            <InputWrapper>
              <Input placeholder = "First name" type = "text" required error = "false" name = "fName" pattern="[a-zA-Z]*"/>
              <Error></Error>
            </InputWrapper>
            <InputWrapper>
              <Input placeholder = "Last Name" type = "text" required error = "false" name = "lName" pattern="[a-zA-Z]*"/>
              <Error></Error>
            </InputWrapper>
          </Wrapper>
          <InputWrapper>
            <Input placeholder = "Email" type = "email" required name = "email" error = {emailError.toString()}/>
            <Error>{emailError && ('Email is already in use.')}</Error>
          </InputWrapper>
          <InputWrapper>
            <Input placeholder = "Password" type = "password" required name = "password"/>
          </InputWrapper>
          <InputWrapper>
            <Input placeholder = "Confirm password" type = "password" required name = "confPassword" error = {passError.toString()}/>
            <Error>{passError && ("Passwords do not match.")}</Error>
          </InputWrapper>
          <InputWrapper>
            <Input placeholder = "Username" type = "text" name = "username" required/>
          </InputWrapper>
          <Button>Sign me up</Button>
        </Form>
      </Layout>
    </Container>
  )
}

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
max-w-[500px]
w-full
min-w-[300px]
flex
flex-col
`
const InputWrapper = tw.div`
my-[10px]
relative
group
w-full
`
const Input = tw.input`
bg-gray-200
py-[10px]
px-[10px]
outline-none
focus:ring-1
ring-indigo-600
rounded-md
w-full
border-2
invalid:ring-red-500
  valid:ring-indigo-600
  ${(p)=> p.error === "true" ? 'border-red-500 border-[1px] focus:ring-red-500':'ring-indigo-600'}
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
my-[20px]
rounded-md
text-white
hover:bg-indigo-700
active:bg-indigo-800
`
const Wrapper = tw.div`
w-full
flex
justify-between
gap-x-3
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

const Error = tw.p`
opacity-1
absolute
text-xs
text-red-500
`

export default Signup
