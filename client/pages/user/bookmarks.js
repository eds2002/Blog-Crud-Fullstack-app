import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar } from "../../components"
import { verify, decode } from 'jsonwebtoken'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBinoculars, faBook, faDeleteLeft, faGlasses } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import {useState, useEffect} from 'react'
import { useRouter } from "next/router"

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
`

const PageHeading = tw.h1`
text-3xl
font-bold
mt-[50px]
`

const BookmarksGrid = tw.div`
w-full
h-[600px]
bg-gray-200/50
rounded-xl
mt-[25px]
mb-[50px]
grid
lg:grid-cols-3
sm:grid-cols-2
grid-cols-1
overflow-scroll
`

const BookmarkCard = tw.div`
rounded-lg
bg-gray-200
flex
flex-col
h-[250px]
p-[25px]
justify-between
m-[25px]
shadow-xl
transition
`
const BookmarkTitle = tw.h3`
font-bold
text-xl
h-[125px]
overflow-scroll
`
const BookmarkDate = tw.p`
text-gray-500
`
const DeleteBookmark = tw.button`
bg-indigo-600
py-[10px]
flex
items-center
justify-center
rounded-lg
text-white
gap-x-3
border-2
border-indigo-600
hover:bg-indigo-700
active:bg-transparent
active:text-indigo-600
`

const NoBookmarks = tw.div`
flex
flex-col
items-center
justify-center
w-full
col-span-6
`
const NoBookmarksText = tw.p`
text-gray-700
text-2xl
text-center
font-bold
`
const NoBookmarksButton = tw.button`
bg-indigo-600
text-white
py-[10px]
px-[25px]
rounded-lg
my-[12px]
cursor-pointer
border-2
border-indigo-600
hover:bg-indigo-700
active:bg-transparent
active:text-indigo-600
flex
items-center
justify-center
gap-x-3
`

const Bookmarks = () => {
  
  const router = useRouter()
  const [user, setUser] = useState({});
  const [logged, setLogged] = useState(false);
  const [bookmarksArr, setBookmarksArr] = useState()

  useEffect(()=>{
    let userJWT = localStorage.getItem('accessToken')
    if(verify(userJWT, process.env.JWT_SECRET)){
      setUser(decode(userJWT))
      setLogged(true)
    }else{
      router.push('/404')
    }

    const fetchData = async () =>{
      const currentUser = decode(localStorage.getItem('accessToken'))
      // Fetch bookmarks
      const bookmarkRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/bookmarks/${currentUser.id}`)
      const bookmarkData = await bookmarkRes.json()
      let result = bookmarkData.result.map(bookmark => ({ id: bookmark.blog_id}));
      const arrData = JSON.stringify(result)
        
      // Fetch blogs
      const blogsRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/blog/getall/${arrData}`)
      const blogsData = await blogsRes.json()
      setBookmarksArr(blogsData.result)
      console.log(blogsData)
    }
    fetchData()
  },[])


  const removeBookmark = async (id) =>{
    // Update usestate by using filter to remove necessary obj
    setBookmarksArr(bookmarksArr.filter(arr => arr.id != id))
    await axios.delete(`https://mysqlnodeblogapp.herokuapp.com/bookmarks/remove/${id}`)
      .then((res)=>{
      })
  }

  const goToBlog = (id) =>{
    router.push(`/blog/post/${id}`)
  }

  const goToAllBlogs = () =>{
    router.push('/blog/all')
  }

  return (
    <Container>
        <Navbar signed = {logged} user = {user} page = "bookmarks"/>
        <Layout>
            <Wrapper>
              <PageHeading>My Bookmarks</PageHeading>
              <BookmarksGrid className = "scrollbar">
                {!bookmarksArr || bookmarksArr.length === 0 ? 
                  <NoBookmarks>
                    <NoBookmarksText>You have no bookmarks!</NoBookmarksText>
                    <NoBookmarksButton onClick = {()=> goToAllBlogs()}>
                      <FontAwesomeIcon icon = {faBook}></FontAwesomeIcon>
                      Read some blogs
                    </NoBookmarksButton>
                  </NoBookmarks>
                :
                  bookmarksArr.map((blog,key)=>(
                    <>
                      {blog.status != 0 && (
                        <BookmarkCard key = {key}>
                          <BookmarkDate>@{blog.author_username}</BookmarkDate>
                          <BookmarkTitle className = "scrollbar">
                            <p className = "transition cursor-pointer hover:text-indigo-600"onClick = {()=>goToBlog(blog.id)}>
                              {blog.title}
                            </p>
                          </BookmarkTitle>
                          <DeleteBookmark onClick = {()=>removeBookmark(blog.id)}>
                            <FontAwesomeIcon icon = {faDeleteLeft}></FontAwesomeIcon>
                            Delete Bookmark
                          </DeleteBookmark>
                        </BookmarkCard>
                      )}
                    </>
                  ))
                }
              </BookmarksGrid>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default Bookmarks
