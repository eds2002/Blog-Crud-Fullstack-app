import { faFlag, faHeart, faTimes, faEllipsis, faMessage, faDeleteLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import tw from "tailwind-styled-components/dist/tailwind"
import {useState} from 'react'
import { Like } from ".."
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import axios from "axios"
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)
import Image from 'next/image'
import comment from '../../assets/comment.svg'
import { useRouter } from "next/router"

const Wrapper = tw.div`
w-full
h-full
md:flex-col
relative
`

const CommentsHeading = tw.h1`
font-bold
text-2xl
`

const Grid = tw.div`
grid
md:grid-cols-2
grid-cols-1
gap-10
my-[25px]
`

const Comment = tw.div`
bg-white
rounded-xl
p-[25px]
h-[200px]
mb-[50px]
w-full
flex
flex-col
justify-between
`

const FlexRow = tw.div`
flex
justify-between
`

const Username = tw.p`
text-xl
font-bold
hover:text-indigo-600
transition
cursor-pointer
`
const Date = tw.p`
text-base
text-gray-500
`
const Message = tw.p`
my-[10px]
`
const Report = tw.div`
flex
justify-center
items-center
rounded-lg
cursor-pointer
transition
`

const Icon = tw.div`
cursor-pointer
transition
relative
group
pr-[10px]
`

const LikeCount = tw.p`
text-base
`

const AddComment = tw.button`
py-[10px]
px-[20px]
bg-indigo-600
text-white
rounded-lg
font-bold
mt-[10px]
border-2
border-indigo-600
hover:bg-indigo-700
active:bg-transparent
active:text-indigo-600
`

const AddCommentModal = tw.div`
fixed
top-0
bottom-0
right-0
left-0
bg-black/25
z-[99999999999]
flex
justify-center
items-center
`
const CommentWrapper = tw.div`
w-[500px]
h-[300px]
bg-white
rounded-xl
p-[25px]
relative
flex
justify-between
items-center
flex-col
`
const IconWrapper = tw.div`
w-full
h-auto
outline-none
ring-none
focus:outline-none
text-xl
font-bold
flex
justify-center
items-start
`

const CloseBtn = tw.div`
mr-auto
text-xl
cursor-pointer
`

const Textarea = tw.textarea`
w-full
h-[135px]
text-xl
resize-none
bg-transparent
outline-0
border-b-2
`

const PostComment = tw.button`
py-[5px]
px-[10px]
bg-indigo-600
ml-auto
text-white
font-bold
rounded-xl
border-2
border-indigo-600
hover:bg-indigo-700
active:bg-transparent
active:text-indigo-600
transition
`

const Span = tw.span`
w-full
`

const TotalReplies = tw.div`
text-gray-500
transition
text-xl
cursor-pointer
flex
items-center
justify-center
gap-x-2
pl-[20px]
`

const CommentsCount = tw.p`
text-base
`

const MoreSettings = tw.div`
w-[300px]
bg-gray-200
shadow-xl 
rounded-lg
left-0
absolute
pointer-events-none
opacity-0
group-hover:opacity-[100%]
group-hover:pointer-events-auto
`

const DeleteComment = tw.div`
w-full
py-[15px]
rounded-lg
px-[25px]
flex
items-center
justify-start
gap-x-3
hover:bg-gray-300
transition
`

const FlagComment = tw.div`
w-full
py-[15px]
rounded-lg
px-[25px]
flex
items-center
justify-start
gap-x-3
hover:bg-gray-300
transition
`

const NoComments = tw.div`
absolute
left-0
right-0
`

const TextHeading = tw.h1`
font-bold
text-xl
my-[50px]
text-center
`




const Comments = ({blogData, user,comments}) => {
  const router = useRouter()
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

  const [blogComments, setBlogComments] = useState([...comments.result])
  const [flagColor, setFlagColor] = useState(false)
  const [heartColor, setHeartColor] = useState(false)
  const [addComment, setAddComment] = useState(false)

  const [charLength, setCharLength] = useState(0)

  const handleModalClick = (e)=>{
    if(e.target.id === "bg") setAddComment(!addComment)
  }

  
  const handlePostComment = async (e) =>{
    const username = user.username
    const date = new window.Date();
    const comment = e.target.parentElement.querySelector("#commentTextArea").value
    const blogId = blogData.data[0].id
    const userId = user.id
    await axios.post(`https://mysqlnodeblogapp.herokuapp.com/comments/post`,{
      username:username,
      date:date,
      comment:comment,
      blogId:blogId,
      userId:userId,
    })
    .then((res)=>{
      const commentId = res.data.result.insertId
      setBlogComments(oldArray => [...oldArray, {id: commentId,username:username, posted_date:date, content:comment, user_id: currentUser.id}])
      setAddComment(!addComment)
    })
  }

  const deleteComment = async (id)=>{
    await axios.delete(`https://mysqlnodeblogapp.herokuapp.com/comments/delete/${id}`)
      .then((result)=>{
        setBlogComments(blogComments.filter(arr => arr.id != id))
      })
  }

  const sendToUserProfile = (userId) =>{
    router.push(`/profile/${userId}`)
  }

  return (
    <Wrapper>
      <CommentsHeading>Comments</CommentsHeading>
      <AddComment onClick = {()=> setAddComment(currentUser.role === null ? addComment : !addComment)}>Add a comment</AddComment>
      {addComment && (
        <AddCommentModal  id = "bg" onClick = {(e)=>handleModalClick(e)}>
          <CommentWrapper>
            <IconWrapper>
              <CloseBtn onClick = {()=>setAddComment(!addComment)}>
                <FontAwesomeIcon icon = {faTimes}></FontAwesomeIcon>
              </CloseBtn>
            </IconWrapper>
            <Textarea placeholder = "Share your thoughts." name = "commentTextArea" id = "commentTextArea" maxLength="255" onChange = {(e)=>setCharLength(e.target.value.length)}></Textarea>
            <Span>{charLength}/255</Span>
            <PostComment onClick = {(e)=> handlePostComment(e)}>Post Comment</PostComment>
          </CommentWrapper>
        </AddCommentModal>
      )}
      <Grid>
          {/* Check if there are no comments, if there are, suggest to leave a comment */}
          {blogComments.length <= 0 && (
            <NoComments>
              <TextHeading>Be the first to comment.</TextHeading>
            </NoComments>
          )}
          {blogComments.map((comment,index)=>(
            <Comment key = {index} pos = {index}>
              <FlexRow>
                <Username onClick = {()=>sendToUserProfile(comment.user_id)}>@{comment.username}</Username>
                <Date>
                  <ReactTimeAgo date = {comment.posted_date} locale="en-US"/>
                </Date>
              </FlexRow>
              <Message>
                {comment.content}
              </Message>
              <FlexRow>
                <Report>
                  <Icon>
                    <FontAwesomeIcon icon = {faEllipsis}></FontAwesomeIcon>
                    {/* On hover, load more settings for the user */}
                    <MoreSettings>
                    {/* Display delete comment if current user created the comment, if current user is an admin, or if current user is the owner of the blog post */}
                      {currentUser.id === comment.user_id || currentUser.role === "admin" || currentUser.id === blogData.data[0].user_id ? 
                        <>
                          <DeleteComment onClick = {()=>deleteComment(comment.id)}>
                            <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                            Delete Comment
                          </DeleteComment>
                          <FlagComment>
                            <FontAwesomeIcon icon = {faFlag}></FontAwesomeIcon>
                            Flag Comment
                          </FlagComment>
                        </>
                      :
                        <>
                          {/* <FlagComment>
                            <FontAwesomeIcon icon = {faFlag}></FontAwesomeIcon>
                            Flag Comment
                          </FlagComment> */}
                        </>
                      }
                    </MoreSettings>
                  </Icon>
                </Report>
                {/* <FlexRow>
                  <TotalReplies>
                    <FontAwesomeIcon icon = {faMessage}></FontAwesomeIcon>
                    <CommentsCount>0</CommentsCount>
                  </TotalReplies>
                </FlexRow> */}
              </FlexRow>
            </Comment>
          ))
          }
      </Grid>
    </Wrapper>
  )
}

export default Comments
