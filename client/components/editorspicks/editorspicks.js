import tw from "tailwind-styled-components/dist/tailwind"


const Container = tw.section`
w-[100vw]
h-[full]
py-[100px]
`

const Layout = tw.div`
max-w-[1280px]
mx-auto
p-[15px]
`

const Wrapper = tw.div`
w-full
h-full
flex
justify-center
items-start
flex-col
`

const Heading = tw.h1`
font-bold
text-4xl
my-[50px]
`

const Grid = tw.div`
grid
md:grid-cols-3
md:grid-rows-2
grid-cols-1
grid-rows-3
w-full
h-full
md:gap-10
gap-10
`

const Blog = tw.div`
md:w-[80%]
w-full
md:h-[400px]
h-[180px]
md:block
items-center
justify-center
gap-x-5
${(p)=> p.hidden === "true" ? "hidden" : "flex"}
`
const Date = tw.p`
text-xs
text-gray-500
mt-[10px]
mb-[5px]
`
const Title = tw.p`
font-bold
md:text-xl
text-[17px]
cursor-pointer
hover:text-indigo-600
transition
`
const ShortDesc = tw.p`
md:text-[15px]
text-xs
text-gray-500

`
const PlaceholderImage = tw.div`
w-full
md:h-[50%]
h-[100%]
bg-gray-500
rounded-xl
hover:shadow-xl
transition
cursor-pointer
flex-1
`

const TextWrapper = tw.div`
flex-1
`

const editorspicks = () => {
  return (
    <Container>
        <Layout>
            <Wrapper>
                <Heading>Editors Picks.</Heading>
                <Grid>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <TextWrapper>
                            <Date>March 05,2022</Date>
                            <Title>This is a fake recent blog.</Title>
                            <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                        </TextWrapper>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <TextWrapper>
                            <Date>March 05,2022</Date>
                            <Title>This is a fake recent blog.</Title>
                            <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                        </TextWrapper>
                    </Blog>
                    <Blog>
                        <PlaceholderImage></PlaceholderImage>
                        <TextWrapper>
                            <Date>March 05,2022</Date>
                            <Title>This is a fake recent blog.</Title>
                            <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                        </TextWrapper>
                    </Blog>
                    <Blog hidden = "true">
                        <PlaceholderImage></PlaceholderImage>
                        <TextWrapper>
                            <Date>March 05,2022</Date>
                            <Title>This is a fake recent blog.</Title>
                            <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                        </TextWrapper>
                    </Blog>
                    <Blog hidden = "true">
                        <PlaceholderImage></PlaceholderImage>
                        <TextWrapper>
                            <Date>March 05,2022</Date>
                            <Title>This is a fake recent blog.</Title>
                            <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                        </TextWrapper>
                    </Blog>
                    <Blog hidden = "true">
                        <PlaceholderImage></PlaceholderImage>
                        <TextWrapper>
                            <Date>March 05,2022</Date>
                            <Title>This is a fake recent blog.</Title>
                            <ShortDesc>Learn how easy it is to create a blog site.</ShortDesc>
                        </TextWrapper>
                    </Blog>
                </Grid>
            </Wrapper>
        </Layout>
    </Container>
  )
}

export default editorspicks