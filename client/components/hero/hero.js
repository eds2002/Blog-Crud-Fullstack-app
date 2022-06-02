import tw from "tailwind-styled-components/dist/tailwind"
import { useRouter } from "next/router"
const Container = tw.section`
w-[100vw]
h-[100vh]
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
`

const Heading = tw.h1`
text-3xl
font-bold
my-[40px]
`

const FeaturedBlog = tw.div`
w-full
h-[50%]
flex
md:flex-row
flex-col
gap-x-10
items-center

`
const Image = tw.div`
bg-gray-500
md:h-full
max-h-[500px]
w-full
rounded-lg
flex-1
hover:shadow-xl
transition
`
const BlogTextWrapper = tw.div`
flex
flex-col
justify-center
items-start
my-[20px]
md:w-[80%]
w-full
h-full

`
const PublishedDate = tw.p`
text-gray-400
text-base
mb-[10px]
`
const Title = tw.p`
font-bold
md:text-6xl
sm:text-4xl
text-3xl
hover:text-indigo-600
transition
cursor-pointer
`
const Desc = tw.p`
md:text-base
text-gray-500
mt-[10px]
`



const Hero = ({featured}) => {
    const router = useRouter()
    const takeToBlog = (blogId) =>{
        router.push(`/blog/post/${blogId}`)
    }
  return (
    <Container>
        <Layout>
            <Wrapper>
                <Heading>Featured post</Heading>
                <FeaturedBlog>
                    <BlogTextWrapper>
                        <PublishedDate>{new Date(featured[0].date_created).toLocaleDateString()}</PublishedDate>
                        <Title onClick = {()=>takeToBlog(featured[0].id)}>{featured[0].title}</Title>
                        <Desc>{featured[0].author_notes}</Desc>
                    </BlogTextWrapper>
                </FeaturedBlog>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default Hero

  