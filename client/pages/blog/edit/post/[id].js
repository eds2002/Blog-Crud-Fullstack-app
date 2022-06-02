import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar, NavbarStudio } from "../../../../components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag, faBookmark, faTimes, faBoxes, faEyeSlash , faEye} from "@fortawesome/free-solid-svg-icons"
import {verify, decode} from 'jsonwebtoken'
import {useState, useEffect} from 'react'
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
const PublishStatus = tw.div`
font-bold
text-xs
flex
items-center
gap-x-3
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


const Edit = ({user,editBlog}) => {
    const router = useRouter();
    useEffect(()=>{
      let userJWT = localStorage.getItem('accessToken')
      if(verify(userJWT, process.env.JWT_SECRET)){
        const currentUser = decode(userJWT)
        if(!currentUser.id === editBlog.data[0].user_id){
          router.push('/404')
        }
      }
    },[])



    const parseText = JSON.parse(editBlog.data[0].text)
    const [previousText, setPreviousText] = useState(parseText)
    const [inputField, setInputField] = useState([])
    const [title, setTitle] = useState(editBlog.data[0].title)
    const [notes, setNotes] = useState(editBlog.data[0].author_notes)

    const AddP = () =>{
        setInputField([...inputField, {textbox: '', type: 'p'}])
    }

    const AddH = () =>{
        setInputField([...inputField, {textbox: '', type: 'h'}])
    }
    const deleteInput = (index) =>{
        setInputField(inputField.filter((i, position) => position !== index))
    }

    const deleteUserText = (position) =>{
        setPreviousText(previousText.filter((text,index)=> index !== position))
    }

    const handleInput = (e) =>{
        const pos = e.target.parentElement.getAttribute('index')
        const arr = [...inputField]
        arr[pos].textbox = e.target.value
        setInputField(arr)
    }

    const changePreviousText = (index,e) =>{
      // Changing the previos text from blog that was already created. On change, change the array
      const arr = [...previousText]
      arr[index].textbox = e.target.value
      setPreviousText(arr)
    }

    const onPost = async () =>{
        // Variable for empty positons / textboxes
        const emptyPos = []
  
        const body = inputField;
        
        if(!title) return // If title is empty return
        if(!notes) return // If author notes is empty return
        
        // Check for boxes that are empty
        body.forEach((text,index)=>{
          if(text.textbox === '') emptyPos.push(index)
        })

  

        setInputField(body.filter((pos) => pos.textbox !== "")) // Remove empty boxes 
  
        const textArr = []
        inputField.forEach((text)=>{
          if(text.type == "p"){
            textArr.push({type:'p', textbox: text.textbox}) //Pushing the type (p = paragraph, h = heading) and the textbox
          }else{
            textArr.push({type:'h', textbox: text.textbox}) //Pushing the type (p = paragraph, h = heading) and the textbox
          }
        })
        
        const dbText = JSON.stringify([...previousText,...textArr]); // Combining previous user text with new text if any
        const blogId = editBlog.data[0].id
        const dateModified = new window.Date()
        await axios.patch(`https://mysqlnodeblogapp.herokuapp.com/blog/edit/${blogId}`, {
          text:dbText,
          title:title,
          authorNotes:notes,
          status:1,
          dateModified, dateModified
        })
        .then((result)=>{
          router.push(`/blog/post/${blogId}`)
        })
    }

    const saveDraft = async () =>{ //Save draft, same as onPost function just change status to 0
      // Variable for empty positons / textboxes
      const emptyPos = []
  
      const body = inputField;
      
      if(!title) return // If title is empty return
      if(!notes) return // If author notes is empty return
      
      // Check for boxes that are empty
      body.forEach((text,index)=>{
        if(text.textbox === '') emptyPos.push(index)
      })



      setInputField(body.filter((pos) => pos.textbox !== "")) // Remove empty boxes 

      const textArr = []
      inputField.forEach((text)=>{
        if(text.type == "p"){
          textArr.push({type:'p', textbox: text.textbox}) //Pushing the type (p = paragraph, h = heading) and the textbox
        }else{
          textArr.push({type:'h', textbox: text.textbox}) //Pushing the type (p = paragraph, h = heading) and the textbox
        }
      })
      
      const dbText = JSON.stringify([...previousText,...textArr]); // Combining previous user text with new text if any
      const blogId = editBlog.data[0].id
      const dateModified = new window.Date()
      await axios.patch(`https://mysqlnodeblogapp.herokuapp.com/blog/edit/${blogId}`, {
        text:dbText,
        title:title,
        authorNotes:notes,
        status:0,
        dateModified, dateModified
      })
      .then((result)=>{
        router.push(`/blog/post/${blogId}`)
      })
    }

  return (
    <Container>
      <NavbarStudio onPost = {onPost} saveDraft = {saveDraft}/>
        <Layout>
            <Wrapper>
              <ArticleWrapper>
                <ArticleHeader>
                  <TextWrapper>
                    <PublishStatus>
                      {editBlog.data[0].status === 0 ? 
                      <>
                        <FontAwesomeIcon icon = {faEyeSlash} className = "text-red-500"></FontAwesomeIcon>
                        <p className = "text-red-500">Current blog is private</p>
                      </>
                      :
                      <>
                        <FontAwesomeIcon icon = {faEye} className = "text-green-500"></FontAwesomeIcon>
                        <p className = "text-green-500">Current blog is public</p>
                      </> 
                      }
                    </PublishStatus>  
                  </TextWrapper>
                  <Title placeholder = "Title..." onChange = {(e)=>setTitle(e.target.value)} value = {title}/>
                </ArticleHeader>
                <ArticleBody id = "article-body">
                    {previousText.map((paragraph,index)=>(
                        <BodyDiv key = {index} index = {index}>
                            {paragraph.type === "p" ? 
                                <Input type = "p" onChange = {(e)=>changePreviousText(index,e)} value = {paragraph.textbox}/>
                            :
                            <Input type = "h" onChange = {(e)=>changePreviousText(index,e)} value = {paragraph.textbox}/>
                            }
                            <IconClose onClick = {()=> deleteUserText(index)}>
                                <FontAwesomeIcon icon = {faTimes} className = "pointer-events-none"></FontAwesomeIcon>
                            </IconClose>
                        </BodyDiv>
                    ))}
                    {inputField.map((input,index)=>(
                        <BodyDiv key = {index} index = {index}>
                            <Input type = {input.type} onChange = {(e)=>handleInput(e)}/>
                            <IconClose onClick = {()=> deleteInput(index)}>
                                <FontAwesomeIcon icon = {faTimes} className = "pointer-events-none"></FontAwesomeIcon>
                                <p>{index}</p>
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
                  <Description value = {notes} onChange = {(e)=>setNotes(e.target.value)}></Description>
                </InfoWrapper>
              </AuthorInformation>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default Edit

export async function getServerSideProps(context) {
    const id = context.query
    const blogRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/blog/${id.id}`)
    const blogData = await blogRes.json()
    return{props: {editBlog: blogData}}
}
