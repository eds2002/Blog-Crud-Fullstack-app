import tw from "tailwind-styled-components/dist/tailwind"

const Container = tw.section`
w-[100vw]
h-[500px]
bg-gray-200
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
font-bold
text-4xl
my-[50px]
`

const Latest = tw.div`
flex
justify-between
w-full
h-full
overflow-scroll
gap-x-[100px]
`

const Blog = tw.div`
min-w-[275px]
min-h-[175px]
max-w-[275px]
max-h-[175px]
`
const Date = tw.p`
text-xs
text-gray-500
mt-[10px]
mb-[5px]
`
const Title = tw.p`
font-bold
text-xl
cursor-pointer
hover:text-indigo-600
transition
`
const ShortDesc = tw.p`
text-[15px]
text-gray-500
`
const PlaceholderImage = tw.div`
w-full
h-full
bg-gray-500
rounded-xl
hover:shadow-xl
transition
cursor-pointer
`


const latestArticles = () => {
  return (
    <Container>
        <Layout>
            <Wrapper>
                <Heading>Latest in Blog.</Heading>
                <Latest className = "scrollbar">
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <Date>March 05,2022</Date>
                        <Title>This is a fake recent blog.</Title>
                        <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                    </Blog>
                </Latest>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default latestArticles