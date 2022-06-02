import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar, NavbarStudio } from "../../components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag, faBookmark, faTimes, faBoxes } from "@fortawesome/free-solid-svg-icons"
import {verify, decode} from 'jsonwebtoken'
import {useState, useCallback, useEffect} from 'react'
import ReactHtmlParser from 'html-react-parser';
import { useRouter } from "next/router"
import axios from "axios"

const Container = tw.section`
w-[100vw]
h-full
bg-gray-100
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
md:flex
`

const ArticleHeader = tw.div`
md:w-[90%]
w-full
h-[70vh]
flex
justify-center
items-start
flex-col
pb-[100px]
`
const AuthorInformation = tw.div`
md:w-[20%]
w-full
h-[90vh]
p-[25px]
bg-gray-100
md:flex
justify-center
items-start
md:flex-col
`
const TextWrapper = tw.div`
flex
`
const Date = tw.div`
text-gray-500
font-bold
text-xs
`
const Tag = tw.div``
const Title = tw.textarea`
md:text-7xl
text-6xl
font-bold
md:w-[70%]
w-full
my-[10px]
h-[400px]
resize-none
border-[1px]
border-gray-600
bg-transparent
hover:ring-2
hover:ring-indigo-600/50
focus:ring-3
focus:ring-indigo-600
outline-none
transition
rounded
`
const AuthorName = tw.div`
font-bold
text-gray-500
`
const Description = tw.textarea`
text-base
text-gray-500
h-[150px]
w-full
resize-none
border-[1px]
border-gray-600
bg-transparent
hover:ring-2
hover:ring-indigo-600/50
focus:ring-3
focus:ring-indigo-600
outline-none
transition
rounded
`


const ArticleBody = tw.div`
w-full
`


const ArticleWrapper = tw.div`
md:w-[80%]
w-full

`

const InfoWrapper = tw.div`
mt-[35px]
`

const AddTextArea = tw.div`
text-base
md:w-[600px]
w-[300px]
w-full
flex
gap-x-3
mb-[100px]
`
const AddParagraph = tw.button`
py-[10px]
flex-1
w-full
border-2
border-indigo-600
text-indigo-900
rounded-lg
font-bold
bg-indigo-600/10
`
const AddHeading = tw.button`
py-[10px]
flex-1
w-full
bg-blue-500/10
border-2
border-blue-500
font-bold
text-blue-900
rounded-lg
`

const BodyDiv = tw.div`
relative
md:w-[600px]
w-full
`
const Input = tw.textarea`
text-base
md:w-[600px]
w-[300px]
w-full
my-[10px]
bg-transparent
outline-none


border-2
border-indigo-600
hover:ring-2
hover:ring-indigo-600/25
focus:ring-2
focus:ring-indigo-600/75

${(p)=> p.type === "p" ? 
    `
    border-2
    border-indigo-600
    hover:ring-2
    hover:ring-indigo-600/25
    focus:ring-2
    focus:ring-indigo-600/75
    bg-indigo-100
    text-gray-500
    h-[150px]
    `
: 
    `
    border-2
    border-blue-600
    hover:ring-2
    hover:ring-blue-500/25
    focus:ring-2
    focus:ring-blue-500/75
    bg-blue-100
    font-bold 
    text-2xl 
    md:w-[600px]
    h-[75px]
    `}

font-normal
resize-none
transition
rounded-lg
p-[15px]
`

const IconClose = tw.div`
absolute
top-0
right-0
pt-[15px]
pr-[15px]
text-xl
cursor-pointer
hover:text-blue-600
transition
`

const Create = () => {
    const router = useRouter();
    const [user, setUser] = useState('');
    const [logged, setLogged] = useState(false);
    useEffect(()=>{
      let userJWT = localStorage.getItem('accessToken')
      if(verify(userJWT, process.env.JWT_SECRET)){
        setUser(decode(userJWT))
        setLogged(true)
      }
    },[])

    const [state,updateState] = useState()
    const forceUpdate = useCallback(() => updateState({}), []);
    const [inputField, setInputField] = useState([])
    const [title, setTitle] = useState('')
    const [notes, setNotes] = useState('')

    console.log(user)
    const AddP = () =>{
        setInputField([...inputField, {textbox: '', type: 'p'}])
    }

    const AddH = () =>{
        setInputField([...inputField, {textbox: '', type: 'h'}])
    }

    const deleteInput = (index) =>{
        let pos = index.target.parentElement.getAttribute('index')
        const arr = inputField
        arr.splice(pos,1)
        setInputField(arr)
        forceUpdate()
    }

    const handleInput = (e) =>{
        const pos = e.target.parentElement.getAttribute('index')
        const arr = inputField
        arr[pos].textbox = e.target.value
        setInputField(arr)
    }

    // Publish post
    const onPost = async () =>{
      // Variable for empty positons / textboxes
      const emptyPos = []

      const body = inputField;

      
      // If the user has no textboxes present, return
      if(body.length <= 0) return
      // If title is empty return
      if(!title) return
      // If author notes is empty return
      if(!notes) return
      // If user is starting their blog with a heading component, return an error
      if(body[0].type === "h") return alert("Body can not start with a heading.")




      // Check for boxes that are empty
      body.forEach((text,index)=>{
        if(text.textbox === '') emptyPos.push(index)
      })

      // Remove empty boxes 
      const dbBody = body.filter((pos) => pos.textbox !== "")
      setInputField(dbBody)
      forceUpdate()


      //adding styling to user paragraph and headers for db storage
      const textArr = []
      dbBody.forEach((text)=>{
        if(text.type == "p"){
          // textArr.push(`<p className = "text-gray-500 md:w-[600px] text-base my-[30px] w-full">${text.textbox}</p>`)
          textArr.push({type:'p', textbox: text.textbox})
        }else{
          // textArr.push(`<h3 className = "font-bold text-2xl md:w-[600px]">${text.textbox}</h3>`)
          textArr.push({type:'h', textbox: text.textbox})
        }
      })
      const userId = user.id
      const dbText = JSON.stringify(textArr);
      const date = new window.Date();


      await axios.post('https://mysqlnodeblogapp.herokuapp.com/blog/create', {
        userId:userId,
        text:dbText,
        title:title,
        dateCreated: date,
        status: 1,
        authorNotes:notes,
        author:user.firstName,
        authorUsername:user.username,
      })
      .then((result)=>{
        const postId = result.data.message.insertId
        router.push(`/blog/post/${postId}`)
      })
    }


    // Save post {same logic as publish post just change status to 0 meaning unpublished}
    const saveDraft = async () =>{
      // Variable for empty positons / textboxes
      const emptyPos = []

      const body = inputField;


      // If the user has no textboxes present, return
      if(body.length <= 0) return
      // If title is empty return
      if(!title) return
      // If author notes is empty return
      if(!notes) return
      // If user is starting their blog with a heading component, return an error
      if(body[0].type === "h") return alert("Body can not start with a heading.")




      // Check for boxes that are empty
      body.forEach((text,index)=>{
        if(text.textbox === '') emptyPos.push(index)
      })

      // Remove empty boxes 
      const dbBody = body.filter((pos) => pos.textbox !== "")
      setInputField(dbBody)
      forceUpdate()


      //adding styling to user paragraph and headers for db storage
      const textArr = []
      dbBody.forEach((text)=>{
        if(text.type == "p"){
          // textArr.push(`<p className = "text-gray-500 md:w-[600px] text-base my-[30px] w-full">${text.textbox}</p>`)
          textArr.push({type:'p', textbox: text.textbox})
        }else{
          // textArr.push(`<h3 className = "font-bold text-2xl md:w-[600px]">${text.textbox}</h3>`)
          textArr.push({type:'h', textbox: text.textbox})
        }
      })
      const userId = user.id
      const dbText = JSON.stringify(textArr);
      const date = new window.Date();


      await axios.post('https://mysqlnodeblogapp.herokuapp.com/blog/create', {
        userId:userId,
        text:dbText,
        title:title,
        dateCreated: date,
        status: 0,
        authorNotes:notes,
        author:user.firstName,
        authorUsername:user.username,
      })
      .then((result)=>{
        const postId = result.data.message.insertId
        router.push(`/blog/post/${postId}`)
      })
    }


  return (
    <Container>
      <NavbarStudio onPost = {onPost} saveDraft = {saveDraft}/>
        <Layout>
            <Wrapper>
              <ArticleWrapper>
                <ArticleHeader>
                  <Title placeholder = "Title..." onChange = {(e)=>setTitle(e.target.value)} required/>
                </ArticleHeader>
                <ArticleBody>
                    {inputField.map((input,index)=>(
                        <BodyDiv key = {index} index = {index}>
                            <Input type = {input.type} onChange = {(e)=>handleInput(e)}/>
                            <IconClose onClick = {(e)=> deleteInput(e)}>
                                <FontAwesomeIcon icon = {faTimes} className = "pointer-events-none"></FontAwesomeIcon>
                            </IconClose>
                        </BodyDiv>
                    ))}
                    <AddTextArea>
                        <AddParagraph onClick = {()=>AddP()}>{`Add Paragraph <p>`}</AddParagraph>
                        <AddHeading onClick = {()=> AddH()}>{`Add Heading <h3>`}</AddHeading>
                    </AddTextArea>
                </ArticleBody>
              </ArticleWrapper>



              <AuthorInformation>
                <InfoWrapper>
                  <AuthorName>Author Notes:</AuthorName>
                  <Description required onChange = {(e)=>setNotes(e.target.value)}></Description>
                </InfoWrapper>
              </AuthorInformation>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default Create

// export async function getServerSideProps({req,res}) {
//   const jwt = req.cookies.userToken || null
//     try{
//         verify(jwt, process.env.JWT_SECRET)
//         return{props: {user:decode(jwt)}}
//     }catch(e){
//       return {
//         // redirect: {
//         //   permanent: false,
//         //   destination: "/404",
//         // },
//         props:{},
//       };
//     }
// }
