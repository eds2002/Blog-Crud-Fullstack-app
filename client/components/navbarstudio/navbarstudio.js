import tw from "tailwind-styled-components/dist/tailwind"
import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Container = tw.section`
w-[100vw]
h-[75px]
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
flex
justify-between
items-center
relative
`

const Logo = tw.div`
text-2xl
font-bold
flex
justify-start
items-center
flex
justify-start
w-full
h-full
`

const Nav = tw.nav`
h-full
flex
items-center
justify-center
`

const Item = tw.li`
flex
justify-center
items-center
gap-x-5
text-[14px]
h-full
`

const User = tw.div`
w-[35px]
h-[35px]
bg-gray-500
rounded-full
cursor-pointer
relative
`
const Image = tw.div``

const LinkName = tw.a`
py-[5px]
px-[3px]
relative
text-center
justify-center
items-center
${(p) => p.active === "true" ? 
`
  text-indigo-700
  font-bold
  after:content-['']
  after:absolute
  after:h-[3px]
  after:left-0
  after:right-0
  after:bg-indigo-700
  after:rounded-full
  after:left-0
  after:bottom-0
`
:  
`
  text-gray-400
  after:content-['']
  after:absolute
  after:h-[3px]
  after:w-[0%]
  after:bg-gray-400/50
  after:rounded-full
  after:left-0
  after:bottom-0
  after:transition-all
  hover:after:w-[100%]
`
}
cursor-pointer
`

const Button = tw.button`
w-[125px]
py-[10px]
bg-indigo-700
text-white
rounded-lg
hover:bg-indigo-800
active:bg-indigo-900
`

const SaveDraft = tw.button`
w-[110px]
py-[10px]
px-[10px]
bg-slate-700
text-white
rounded-lg
hover:bg-slate-800
active:bg-slate-900
`

const ButtonsWrapper = tw.div`
flex
gap-x-2
`



const navbarstudio = ({onPost,saveDraft}) => {
  return (
    <Container>
      <Layout>
        <Wrapper>
          <Link href = "/">
            <Logo><p className = "cursor-pointer">{`Blog [Studio]`}</p></Logo>
          </Link>
          <Nav>
            <Item>
              {/* <Link href = "blog/all"><LinkName className = "hidden md:block">FAQ</LinkName></Link>
              <User>
              <Image></Image>
              </User> */}
              <ButtonsWrapper>
                <SaveDraft onClick = {()=>saveDraft()}>Save as draft</SaveDraft>
                <Button onClick = {()=>onPost()}>Publish blog</Button>
              </ButtonsWrapper>
            </Item>
          </Nav>

        </Wrapper>
      </Layout>
    </Container>
  )
}

export default navbarstudio
