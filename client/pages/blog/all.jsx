import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar } from "../../components"
import { verify, decode } from 'jsonwebtoken'
import { useRouter } from "next/router"
import {useState, useEffect} from 'react'


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

const Grid = tw.div`
w-full
grid
lg:grid-cols-4
md:grid-cols-3
sm:grid-cols-2
grid-cols-1
gap-10
mt-[50px]
mb-[100px]
`

const BlogCard = tw.div`
w-full
h-[250px]
rounded-xl
bg-gray-200
shadow-xl
p-[25px]
flex
justify-center
items-start
flex-col
`

const Header = tw.h1`
text-3xl
font-bold
my-[25px]
w-full
border-b-2
py-[10px]
border-gray-300
`

const PostedDate = tw.p`
text-gray-500
text-xs
`

const Title = tw.h3`
font-bold
text-xl
hover:text-indigo-600
cursor-pointer
transition
`

const Description = tw.p`
text-gray-700
text-lg
`

const AuthorName = tw.p`
text-gray-500
text-xs
py-[3px]
px-[2px]
cursor-pointer
hover:text-indigo-600
transition
`


const All = ({allBlogs}) => {
  const router = useRouter()
  const [user, setUser] = useState('');
  const [logged, setLogged] = useState(false);
  useEffect(()=>{
    let userJWT = localStorage.getItem('accessToken')
    if(userJWT){
      if(verify(userJWT, process.env.JWT_SECRET)){
        setUser(decode(userJWT))
        setLogged(true)
      }
    }
  },[])
  const goToBlog = (id) =>{
    router.push(`/blog/post/${id}`)
  }
  const takeToBlogger = (userId) =>{
    router.push(`/profile/${userId}`)
  }
  return (
    <Container>
        <Navbar signed = {logged} user = {user} page = "blogAll"/>
        <Layout>
            <Wrapper>
              <Header>All posts</Header>
              <Grid>
                {allBlogs.map((blog)=>(
                  <>
                    {blog.status != 0 && (
                      <BlogCard>
                        <AuthorName onClick = {()=>takeToBlogger(blog.user_id)}>@{blog.author_username}</AuthorName>
                        <PostedDate>{new Date(blog.date_created).toLocaleDateString()}</PostedDate>
                        <Title onClick = {()=>goToBlog(blog.id)}>{blog.title}</Title>
                      </BlogCard>
                    )}
                  </>
                ))}
              </Grid>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default All

export async function getServerSideProps({req,res}) {
  const jwt = req.cookies.userToken || null
  const allBlogsRes = await fetch('https://mysqlnodeblogapp.herokuapp.com/blog')
  const allBlogsData = await allBlogsRes.json()
  try{
      verify(jwt, process.env.JWT_SECRET)
      return{props: {user:decode(jwt),logged:true, allBlogs: allBlogsData}}
    }catch(e){
    return{props: {logged:false, allBlogs: allBlogsData}}
  }
}
