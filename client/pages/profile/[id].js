import { useRouter } from "next/router"
import tw from "tailwind-styled-components/dist/tailwind"
import { Navbar } from "../../components"
import {verify,decode} from 'jsonwebtoken'
import {useState, useEffect} from 'react'
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
`

const Wrapper = tw.div`
w-full
h-full
relative
`

const UserProfile = tw.div`
h-[500px]
bg-indigo-200
rounded-t-[50px]
rounded-bl-[75px]
px-[15px]
flex
justify-center
items-center
flex-col
`

const UserBlogs = tw.div`
h-[500px]
w-full
bg-indigo-200
mb-[100px]
`

const BlogsWrapper = tw.div`
w-full
h-full
bg-gray-100
rounded-tr-[75px]
p-[50px]
`

const ImageWrapper = tw.div`
max-w-[175px]
max-h-[175px]
w-full
h-full
bg-gray-500
rounded-xl
`

const Username = tw.h1`
text-3xl
font-bold
mt-[25px]
`

const Description = tw.p`
text-gray-500
`

const Filters = tw.div`
flex
w-full
`

const AllBlogs = tw.div`
py-[5px]
bg-indigo-600
text-white
px-[15px]
rounded-full
cursor-pointer
`

const BlogCard = tw.div`
bg-gray-200
rounded-3xl
p-[25px]
h-[300px]
cursor-pointer
flex
items-center
justify-center
flex-col
group
hover:bg-indigo-100
transition
`

const BlogTitle = tw.h3`
text-3xl
font-bold
text-center
my-[15px]
group-hover:text-indigo-600
transition
`

const BlogDescription = tw.p`
text-lg
text-gray-500
text-center
my-[15px]
`

const BlogsGrid = tw.div`
w-full
my-[50px]
h-full
grid
lg:grid-cols-3
md:grid-cols-2
sm:grid-cols-1
gap-5
`

const NoBlogs = tw.div`
w-full
h-[400px]
col-span-6
flex
justify-center
items-center
font-bold
text-2xl
text-center
bg-gray-200/50
rounded-3xl
`



const Profile = ({userBlogs,userProfile}) => {
  const router = useRouter()
  const [user, setUser] = useState({});
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
  console.log(userBlogs,userProfile)


  const takeToBlog = (blogId) =>{
    router.push(`/blog/post/${blogId}`)
  }
  return (
    <Container>
      <Navbar user = {user} signed = {logged}/>
      <Layout>
        <Wrapper>
          <UserProfile>
            <ImageWrapper></ImageWrapper>
            <Username>{userProfile[0].first_name} {userProfile[0].last_name}</Username>
            <p>@{userProfile[0].username}</p>
            <Description>Blogger at Blog.</Description>
          </UserProfile>
          <UserBlogs>
            <BlogsWrapper>
              <Filters>
                <AllBlogs>All Blogs</AllBlogs>
              </Filters>
              <BlogsGrid>
                {userBlogs.length === 0 && (
                  <NoBlogs>
                    This user hasn&#39;t posted any blogs yet!
                  </NoBlogs>
                )}
                {userBlogs.map((blog,index)=>(
                  <>
                    {blog.status === 1 && (
                      <BlogCard onClick = {()=>takeToBlog(blog.id)} key = {index}>
                        <BlogTitle>{blog.title}</BlogTitle>
                        <BlogDescription>{blog.author_notes}</BlogDescription>
                      </BlogCard>
                    )}
                  </>
                ))}
              </BlogsGrid>
            </BlogsWrapper>
          </UserBlogs>
        </Wrapper>
      </Layout>
    </Container>
  )
}

export default Profile

export async function getServerSideProps(context) {
  const {id} = context.query

  // Getting the requsted users blog data
  const profileBlogsRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/profile/blogs/${id}`)
  const profileBlogsData = await profileBlogsRes.json()

  // Getting the requested users profile data
  const profileUserRes = await fetch(`https://mysqlnodeblogapp.herokuapp.com/user/profile/${id}`)
  const profileUserData = await profileUserRes.json()
  if(profileUserData.result.length != 0){
    return {props:{userBlogs:profileBlogsData.result, userProfile: profileUserData.result}}
  }else{
    return {
        redirect: {
          permanent: false,
          destination: "/404"
        }
    }
  }


}