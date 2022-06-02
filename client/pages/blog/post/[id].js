import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar, Comments } from "../../../components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFlag, faBookmark, faDeleteLeft, faPen, faTimes, faSignIn } from "@fortawesome/free-solid-svg-icons"
import ReactHtmlParser from 'html-react-parser';
import {verify, decode} from 'jsonwebtoken'
import {useState, useEffect} from 'react'
import axios from "axios";
import { useRouter } from "next/router";


const Container = tw.section`
w-[100vw]
h-full
bg-gray-100
overflow-hidden
`

const Layout = tw.div`
max-w-[1280px]
h-full
mx-auto
p-[15px]
overflow-hidden
`

const Wrapper = tw.div`
w-full
h-full
md:flex
overflow-hidden
`

const ArticleHeader = tw.div`
md:w-[100%]
w-full
md:h-[90vh]
h-[85vh]
flex
justify-center
items-start
flex-col
pb-[100px]
`
const AuthorInformation = tw.div`
w-full
md:h-[90vh]
h-full
mb-[50px]
md:mb-[0px]
p-[5px]
justify-center
items-start
md:w-[30%]
md:flex
md:flex-col

`
const TextWrapper = tw.div`
flex
`
const CreatedDate = tw.div`
text-gray-500
font-bold
text-xs
`
const Tag = tw.div``
const Title = tw.div`
md:text-7xl
text-6xl
font-bold
md:w-[70%]
w-full
my-[10px]
`
const AuthorName = tw.div`
font-bold
text-gray-500
`
const Description = tw.div`
text-base
text-gray-500
`


const ArticleBody = tw.div`
w-full
`


const ArticleWrapper = tw.div`
md:w-[80%]
w-full

`

const Paragraph = tw.p`
text-gray-500 
md:w-[600px] 
md:text-xl
text-base 
my-[30px] 
w-full
`


const Buttons = tw.div`
w-full
`

const Bookmark = tw.button`
w-full
rounded-lg
bg-indigo-600
text-white
py-[10px]
my-[20px]
flex
gap-x-3
items-center
justify-center
hover:bg-indigo-700
active:bg-transparent
active:text-indigo-600
border-2
border-indigo-600
transition
`

const InfoWrapper = tw.div`
mt-[35px]
`

const Author = tw.p`
font-bold
text-xl
`

const MeetAuthor = tw.div`
flex
md:w-[600px]
sm:h-[200px]
h-[300px]
mt-[10px]
mb-[50px]
gap-x-3
bg-gray-300
p-[15px]
rounded-xl
shadow
hover:shadow-xl
transition
cursor-pointer
`

const AuthorImage = tw.div`
w-[200px]
h-full
bg-gray-500
rounded-lg
`

const AuthorPersonal = tw.div`
flex-1
w-full
`

const AuthorDescription = tw.p`
font-gray-500
md:text-base
text-base
`

const Name = tw.h1`
font-bold
text-xl

`

const MeetAuthorHeading = tw.p`
font-bold
text-3xl
mt-[100px]
`

const DeletePost = tw.div`
w-full
rounded-lg
bg-red-600
text-white
py-[10px]
my-[20px]
flex
gap-x-3
items-center
justify-center
hover:bg-red-700
active:bg-transparent
active:text-red-600
border-2
border-red-600
transition
cursor-pointer
`

const EditPost = tw.div`
w-full
rounded-lg
bg-slate-600
text-white
py-[10px]
my-[20px]
flex
gap-x-3
items-center
justify-center
hover:bg-slate-700
active:bg-transparent
active:text-slate-600
border-2
border-slate-600
transition
cursor-pointer
`

const DeleteModal = tw.div`
fixed
top-0
bottom-0
left-0
right-0
bg-black/25
z-[99999999999999999999999999999999]
flex
items-center
justify-center
`

const DelWrapper = tw.div`
bg-white
p-[50px]
rounded-xl
`
const TextH1 = tw.h1`
text-center
text-3xl
font-bold
`
const TextP = tw.div`
w-[30ch]
text-center
`

const DelBtnWrapper = tw.div`
flex
w-full
gap-x-3
mt-[15px]
`

const DelButton = tw.button`
flex-1
w-full
bg-red-500
rounded-lg
py-[10px]
font-bold
text-white
border-2
border-red-500
hover:bg-red-600
active:bg-transparent
active:text-red-500
`
const CloseBtn = tw.button`
flex-1
w-full
bg-slate-500
rounded-lg
py-[10px]
font-bold
text-white
border-2
border-slate-500
hover:bg-slate-600
active:bg-transparent
active:text-slate-500
`

const Heading = tw.h3`
font-bold 
text-2xl 
md:w-[600px]
`

const SignupModal = tw.div`
fixed
top-0
left-0
right-0
bottom-0
bg-black/50
flex
items-center
justify-center
z-[99999999999999999999999999999999999999999999999999999999999999999999999999999999]
`
const SignupModalWrapper = tw.div`
w-full
mx-[15px]
max-w-[600px]
h-[300px]
relative
bg-white
flex
justify-center
items-center
flex-col
gap-y-5
relative
rounded-xl
`
const SignUpHeading = tw.h1`
md:text-3xl
text-xl
font-bold
`
const SignUpButton = tw.button`
py-[10px]
px-[15px]
w-full
max-w-[300px]
bg-indigo-600
text-white
rounded-lg
border-2
border-indigo-600
hover:bg-indigo-700
active:bg-transparent
active:text-indigo-600
flex
justify-center
items-center
gap-x-3
`
const CloseSignUp = tw.div`
absolute
top-0
right-0
m-[20px]
p-[5px]
cursor-pointer
`


const Post = ({id,comments, userBookmark}) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [logged, setLogged] = useState(false);
  const [bookmarkData, setBookmarkData] = useState();
  const [userBookmarked, setUserBookmarked] = useState(false)
  const [bookmarkId, setBookmarkId] = useState()
  useEffect(()=>{
    let userJWT = localStorage.getItem('accessToken')
    if(userJWT){
      if(verify(userJWT, process.env.JWT_SECRET)){
        setUser(decode(userJWT))
        setLogged(true)
      }
      async function fetchData() {
        const currentUser = decode(localStorage.getItem('accessToken'))
        const userBookmark = await fetch(`https://mysqlnodeblogapp.herokuapp.com/bookmarks/${id.data[0].id}/${userJWT.id}`)
        const userBookmarkData = await userBookmark.json()
        setBookmarkId(userBookmarkData.result.length === 0 ? null : userBookmarkData.result[0].id)
        setUserBookmarked(userBookmarkData.result.length === 0 ? false : userBookmarkData.result.some(id => id.user_id === currentUser.id))
        setBookmarkData(userBookmarkData)
      }
      fetchData()
    }
  },[])
  console.log(userBookmarked)


  const parseText = JSON.parse(id.data[0].text)
  
  // If a user exists (if mysql returns an empty array, the user hasn't bookmarked this page, else the user did bookmark), if no user set to null
  const [delModal, setDelModal] = useState(false)
  const [registerModal, setRegisterModal] = useState(false)




  // Setting current user for components
  let currentUser = {};
  if(!user){
    currentUser={
      id:null,
      role:null,
    }
  }else{
    currentUser = {
      id:user.id,
      role:user.role
    }
  }


  // Deleting the post
  const handleDelete = async () =>{
    const postId = id.data[0].id


    await axios.delete(`https://mysqlnodeblogapp.herokuapp.com/blog/delete/${postId}`)
    router.push('/')
  }

  
  const addToBookmarks = async () =>{
    // If user is not logged, do not run function
    if(currentUser.role === null){
      setRegisterModal(!registerModal)
      return;
    }


    // If user has not bookmarked this page, then apply logic to add the bookmark to user
    if(!userBookmarked){
      const userId = currentUser.id
      const blogId = id.data[0].id
      const time = new window.Date()
      await axios.post('https://mysqlnodeblogapp.herokuapp.com/bookmarks/add',{
        userId:userId,
        blogId:blogId,
        time:time,
      })
        .then((res)=>{
          setUserBookmarked(true)
          setBookmarkId(res.data.result.insertId) 
        })
      return;
    }

      // Apply logic to remove bookmark from users bookmarks
      await axios.delete(`https://mysqlnodeblogapp.herokuapp.com/bookmarks/delete/${bookmarkId}`)
        .then((res)=>{
          setUserBookmarked(false)
        })
  }

  const editPost = async (id) =>{
    router.push(`/blog/edit/post/${id}`)
  } 

  const takeToSignUp = () =>{
    router.push('/user/signup')
  }


  return (
    <Container>
      <Navbar page = "post" signed = {logged} user = {user}/>
        <Layout>
            <Wrapper>
              <ArticleWrapper>
                <ArticleHeader>
                  <TextWrapper>
                    <CreatedDate>{new Date(id.data[0].date_created).toLocaleDateString()}</CreatedDate>
                  </TextWrapper>
                  <Title>{id.data[0].title}</Title>
                </ArticleHeader>
                <ArticleBody>
                    {parseText.map((paragraph)=>(
                      <>{paragraph.type === "p" ? 
                        <Paragraph>{paragraph.textbox}</Paragraph>
                      :
                        <Heading>{paragraph.textbox}</Heading>
                      }</>
                    ))}
                </ArticleBody>
                {/* <MeetAuthorHeading>Meet the author</MeetAuthorHeading>
                <MeetAuthor>
                  <AuthorImage></AuthorImage>
                  <AuthorPersonal>
                    <Name>Eduardo Sanchez</Name>
                    <AuthorDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae cumque accusantium, exercitationem nobis omnis saepe soluta praesentium pariatur aliquid dicta quaerat ab magnam velit accusamus aliquam rem, quae voluptatibus in!</AuthorDescription>
                  </AuthorPersonal>
                </MeetAuthor> */}
              </ArticleWrapper>


              <AuthorInformation>
                <InfoWrapper>
                  <AuthorName>Author Notes:</AuthorName>
                  <Description>
                    {id.data[0].author_notes}
                  </Description>
                </InfoWrapper>
                <Buttons>
                  <Bookmark onClick = {()=>addToBookmarks()}>
                    <FontAwesomeIcon icon = {faBookmark}></FontAwesomeIcon>
                    {userBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                  </Bookmark>
                  {currentUser.role === "admin" || currentUser.id=== id.data[0].user_id ?
                    <>
                      {currentUser.id === id.data[0].user_id &&
                        <EditPost onClick = {()=>editPost(id.data[0].id)}>
                          <FontAwesomeIcon icon = {faPen}></FontAwesomeIcon>
                          Edit Post
                        </EditPost>
                      }
                      <DeletePost onClick = {()=>setDelModal(!delModal)}>
                        <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                        Delete post
                      </DeletePost>
                    </>
                  :
                    ""
                  }
                </Buttons>
              </AuthorInformation>



              {delModal && (
              <DeleteModal>
                <DelWrapper>
                  <TextH1>Before you delete.</TextH1>
                  <TextP>You are about to delete {user.id === id.data[0].user_id ? "your own" : `${user.firstName} ${user.lastName}'s`} post, are you sure you want to do this?</TextP>
                  <DelBtnWrapper>
                    <CloseBtn onClick = {()=>setDelModal(!delModal)}>
                      Nevermind
                    </CloseBtn>
                    <DelButton onClick = {()=>handleDelete()}>
                      Delete post
                    </DelButton>
                  </DelBtnWrapper>
                </DelWrapper>
              </DeleteModal>
              )}
              {registerModal && (
                <SignupModal>
                  <SignupModalWrapper>
                    <SignUpHeading>Enjoy the full experience at Blog!</SignUpHeading>
                    <SignUpButton onClick = {()=>takeToSignUp()}>
                      <FontAwesomeIcon icon = {faSignIn}></FontAwesomeIcon>
                      Sign up
                    </SignUpButton>
                    <CloseSignUp onClick = {()=>setRegisterModal(!registerModal)}>
                      <FontAwesomeIcon icon = {faTimes}></FontAwesomeIcon>
                    </CloseSignUp>
                  </SignupModalWrapper>
                </SignupModal>
              )
              }
            </Wrapper>
            <Comments blogData = {id} user = {user} comments = {comments} />
        </Layout>
    </Container>
  )
}

export default Post


export async function getServerSideProps(context){
   // Get the id from url 
  const { id } = context.query;

  // Fetch blog id to load onto page
  const blogRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/blog/${id}`)
  const blogData = await blogRes.json()

  // Fetch comments from blog id
  const commentRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/comments/blog/${id}`)
  const commentData = await commentRes.json()


  // If blog data receives null, redirect, no page exists
  if(blogData.error === null){
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props:{},
    };
  } 
  return {props:{comments:commentData, id:blogData}}
}


// export async function getServerSideProps(context) {
//   // Get the id from url 
//   const { id } = context.query;

//   // Fetch blog id to load onto page
//   const blogRes = await fetch(`http://localhost:4001/blog/${id}`)
//   const blogData = await blogRes.json()

//   // Fetch comments from blog id
//   const commentRes = await fetch(`http://localhost:4001/comments/blog/${id}`)
//   const commentData = await commentRes.json()


//   // If blog data receives null, redirect, no page exists
//   if(blogData.error === null){
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/404",
//       },
//       props:{},
//     };
//   }



//   // Checking if jwt is valid
//   const jwt = context.req.cookies.userToken;
//   try{
//     // Verify user token
//     verify(jwt, process.env.JWT_SECRET)
//     const userId = decode(jwt)
//     // Check if status is published or not published, if user matches blogId, allow user to view post, other users cannot view post
//     if(blogData.data[0].user_id != userId.id && blogData.data[0].status === 0){
//       return {
//         redirect: {
//           permanent: false,
//           destination: "/404",
//         },
//         props:{},
//       };
//     }

//     // Once token is valid, fetch bookmarks to check if user has bookmarked this page
//     const bookmark = await fetch(`http://localhost:4001/bookmarks/${id}/${userId.id}`)
//     const bookmarkData = await bookmark.json()

//     // Return all data
//     return {props: {user:decode(jwt),logged:true, id:blogData, comments: commentData, userBookmark: bookmarkData}}
//   }catch(error){
//     if(blogData.data[0].status ===0){
//       return {
//         redirect: {
//           permanent: false,
//           destination: "/404",
//         },
//         props:{},
//       };
//     }
//     return {props: {id:blogData, comments: commentData}}
//   }
// }