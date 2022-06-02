import tw from 'tailwind-styled-components/dist/tailwind'
import { Navbar } from '../../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDeleteLeft, faEye, faEyeSlash, faEdit, faCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import {verify, decode} from 'jsonwebtoken'
import {useState} from 'react'
import {useRouter} from 'next/router'
import axios from 'axios'

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
`

const Heading = tw.h1`
text-5xl
font-bold
pt-[25px]
pb-[50px]
`

const AllUserBlogs = tw.h1`
text-xl
font-bold
py-[10px]
`

const BlogCard = tw.div`
bg-gray-200
rounded-xl
p-[25px]
md:grid
sm:grid-cols-5
flex
flex-col
my-[25px]
shadow-lg
gap-y-5

`

const Flex = tw.div`
flex
flex-col
`

const Title = tw.h1`
font-bold
text-xl
col-start-1
col-end-2
cursor-pointer
hover:text-indigo-600
transition
flex
items-center
justify-self-start
`


const Status = tw.div`
text-gray-500
col-start-2
col-end-3
flex
items-center
md:justify-center
gap-x-3
`

const Created = tw.p`
text-gray-500
col-start-3
col-end-4
md:flex
hidden
items-center
justify-center
`

const Modified = tw.p`
text-gray-500
col-start-4
col-end-5
md:flex
hidden
items-center
justify-center

`

const Actions = tw.div`
col-start-5
col-end-6
flex
items-center
justify-center
justify-between
`

const Delete = tw.button`
flex
flex-col
items-center
justify-center
text-gray-400
hover:text-gray-600
transition
`

const Unpublish = tw.button`
flex
flex-col
items-center
justify-center
text-gray-400
hover:text-gray-600
transition
`
const Edit = tw.button`
flex
flex-col
items-center
justify-center
text-gray-400
hover:text-gray-600
transition
`

const IconStatus = tw.div`
text-xs
text-green-500
${(p)=> p.published === "true" ? "text-green-500" : "text-red-500"}
`

const WarningContainer = tw.div`
fixed
top-0
left-0
bottom-0
right-0
z-[9999999999999999]
bg-black/50
flex
items-center
justify-center
`
const WarningWrapper = tw.div`
bg-white
rounded-xl
p-[50px]
flex
justify-center
items-center
flex-col
gap-y-3
`
const DeleteHeading = tw.h2`
font-bold
text-xl
`
const DeleteText = tw.p`
text-lg
text-gray-500
`

const ButtonsWrapper = tw.div`
flex
gap-x-2
mt-[10px]
`

const DeleteButton = tw.button`
bg-red-500
py-[10px]
px-[20px]
rounded-xl
text-white
flex
items-center
justify-center
gap-x-3
border-2
border-red-500
hover:bg-red-600
active:bg-transparent
active:text-red-500
transition
`
const CancelButton = tw.button`
bg-slate-500
py-[10px]
px-[20px]
rounded-xl
text-white
flex
items-center
justify-center
gap-x-3
border-2
border-slate-500
hover:bg-slate-600
active:bg-transparent
active:text-slate-500
transition
`



const UserProfile = ({currentUser, userBlogs}) => {
  const userLogged = currentUser === null ? false : true

  const router = useRouter()
  const [blogsArray, setBlogsArr] = useState(userBlogs.result)
  const [warningModal, setWarningModal] = useState(false)

  const redirectToBlog = (blogId) =>{
    router.push(`/blog/post/${blogId}`)
  }

  const deleteBlog = (blogId) =>{

  }

  const editBlog = (blogId) => {
    router.push(`/blog/edit/post/${blogId}`)
  }

  const changeBlogStatus = async (blogId, status,index) =>{
    // If current status is true/ x>=1 (PUBLISHED), add logic to update status to 0 or false
    if(status >= 1){
      await axios.patch(`https://mysqlnodeblogapp.herokuapp.com/blog/status/${blogId}/0`)
        .then((res)=>{
          blogsArray[index].status = 0
          setBlogsArr([...blogsArray])
        })
    }else{
      // Update status to true, published
      await axios.patch(`https://mysqlnodeblogapp.herokuapp.com/blog/status/${blogId}/1`)
        .then((res)=>{
          blogsArray[index].status = 1
          setBlogsArr([...blogsArray])
        })
    }
  }

  return (
    <Container>
      <Navbar user = {currentUser} signed = {userLogged}/>
      <Layout>
        <Wrapper>
          <Heading>Hi {currentUser.firstName}!</Heading>
          <AllUserBlogs>My blogs</AllUserBlogs>
          <Flex>
            {blogsArray.map((blog,index)=>(
              <BlogCard key = {index}>
                <Title onClick = {()=>redirectToBlog(blog.id)}>{blog.title}</Title>
                  <Status>
                    {blog.status === 1 ? 
                      <>
                        <IconStatus published = "true">
                          <FontAwesomeIcon icon = {faCircle}></FontAwesomeIcon>
                        </IconStatus>
                        Published
                      </>
                    :
                      <>
                        <IconStatus published = "false">
                          <FontAwesomeIcon icon = {faCircle}></FontAwesomeIcon>
                        </IconStatus>
                        Unpublished
                      </>
                    }
                  </Status>
                  <Created>{new Date(blog.date_created).toLocaleDateString()}</Created>
                  <Modified>{blog.date_modified === null ? "N/A" : blog.date_modified}</Modified>
                <Actions>
                  <Delete onClick = {()=> setWarningModal(!warningModal)}>
                    <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                    Delete
                  </Delete>
                  <Unpublish onClick = {()=>changeBlogStatus(blog.id,blog.status, index)}>
                    {blog.status === 1 ? 
                      <>
                        <FontAwesomeIcon icon = {faEyeSlash}></FontAwesomeIcon>
                        Unpublish
                      </>
                    :
                      <>
                        <FontAwesomeIcon icon = {faEye}></FontAwesomeIcon>
                        Publish
                      </>  
                    }
                  </Unpublish>
                  <Edit onClick = {()=>editBlog(blog.id)}>
                    <FontAwesomeIcon icon = {faEdit}></FontAwesomeIcon>
                    Edit
                  </Edit>
                </Actions>
              </BlogCard>
            ))}
            {warningModal && (
              <WarningContainer>
                <WarningWrapper>
                  <DeleteHeading>You are about to delete a post.</DeleteHeading>
                  <DeleteText>Are you sure you want to do this?</DeleteText>
                  <ButtonsWrapper>
                    <DeleteButton>
                      <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                      Delete post
                    </DeleteButton>
                    <CancelButton onClick = {()=> setWarningModal(!warningModal)}>
                      <FontAwesomeIcon icon = {faTimes}></FontAwesomeIcon>
                      Nevermind
                    </CancelButton>
                  </ButtonsWrapper>
                </WarningWrapper>
              </WarningContainer>
            )}
          </Flex>
        </Wrapper>
      </Layout>
    </Container>
  )
}

export default UserProfile

export async function getServerSideProps({req,res}) {
    const jwt = req.cookies.userToken

    if(jwt){
        try{
            verify(jwt, process.env.JWT_SECRET)
            const user = decode(jwt)
            const userBlogsRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/blog/all/${user.id}`);
            const userBlogsData = await userBlogsRes.json()

            return{props: {currentUser:decode(jwt), userBlogs: userBlogsData}}
        }catch(e){
            return {
                redirect: {
                  permanent: false,
                  destination: "/404"
                }
            }
            return{props: {}}
        }
    }

}