import tw from "tailwind-styled-components/dist/tailwind"
import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faBook, faRibbon,faUser, faSignOut,faQuestionCircle, faSignIn, faDashboard, faGears, faPen, faSignOutAlt, faSign} from '@fortawesome/free-solid-svg-icons'
import axios from "axios"
import { useRouter } from "next/router"
import {verify,decode} from 'jsonwebtoken'
axios.defaults.withCredentials = true

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
md:flex
md:justify-between
md:items-center
relative
`

const Logo = tw.div`
text-2xl
font-bold
items-center
md:items-start
md:justify-self-start
md:block
md:w-auto
md:h-auto
flex
w-full
h-full
items-center
justify-center
cursor-pointer
`

const Nav = tw.nav`
md:h-full
md:flex
md:items-center
md:justify-center
hidden
`

const Item = tw.li`
flex
justify-center
items-center
gap-x-10
text-[14px]
h-full
`

const User = tw.div`
relative
`
const Image = tw.div`
w-[40px]
h-[40px]
bg-gray-500
rounded-full
cursor-pointer
`

const UserSettings = tw.div`
absolute
w-[250px]
bg-gray-200
shadow-xl
right-0
rounded-xl
${(p)=> p.display === "true" ? "flex" : " hidden"}
flex-col
`

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
w-[100px]
py-[10px]
bg-indigo-700
text-white
rounded-lg
hover:bg-indigo-800
active:bg-indigo-900
`

const Hamburger = tw.div`
cursor-pointer
md:hidden
absolute
top-[50%]
translate-y-[-50%]
right-0
z-10
`

const Line = tw.div`
w-[26px]
h-[3.5px]
bg-black
my-[10px]
rounded-full
`

const MobNav = tw.div`
w-[50%]
bg-gray-200
fixed
top-0
bottom-0
right-0
px-[15px]
py-[75px]
md:hidden
z-[2]
`

const MobItems = tw.nav`
flex
flex-col
justify-evenly
w-full
h-full
`

const MobLinkName = tw.a`
text-black
py-[15px]
px-[10px]
w-full
font-bold
rounded-lg
flex
items-center
gap-x-[10px]
text-xl
hover:bg-gray-300
transition
cursor-pointer
`

const MobButton = tw.button`
py-[15px]
px-[10px]
text-white
font-bold
rounded-lg
flex
items-center
gap-x-[10px]
text-xl
bg-indigo-600
hover:bg-indigo-700
active:bg-indigo-800
`

const FlexRowWrap = tw.div`
flex
items-center
justify-start
gap-x-3
border-gray-400/30
p-[15px]
hover:bg-gray-400/30
cursor-pointer
rounded-xl
group
`

const Username = tw.p`
text-black
`

const FlexCol = tw.div`
flex
flex-col
`

const TextWrapper = tw.p`
text-md
flex
items-center
justify-center
gap-x-3
text-black
`

const Anchor = tw.a`
w-full
gap-x-4
flex
items-center
justify-center
`



const Navbar = ({user,signed, page,currentUser}) => {
  const router = useRouter();
  const [mobNav, setMobNav] = useState(false)
  const [userDash, setUserDash] = useState(false)

  const signOut = async () =>{
    localStorage.removeItem('accessToken')
    router.push('/')
  }

  const takeToProfile = () =>{
    router.push(`/profile/${user.id}`)
  }



  return (
    <Container>
      <Layout>
        <Wrapper>
          <Link href = "/">
            <Logo>Blog.</Logo>
          </Link>
          <Nav>
            <Item>
              <Link href = "/"><LinkName active = {page === 'home' ? "true" : "false"}>Home</LinkName></Link>
              <Link href = "/blog/all"><LinkName active = {page === "blogAll" ? "true" : "false"}>Blog</LinkName></Link>
              {/* extra options for users that are signed in */}
              {signed ? 
                <>
                  <Link href = "/user/bookmarks"><LinkName active = {page === 'bookmarks' ? "true" : "false"}>Bookmarks</LinkName></Link>
                  {user.role === "admin" && (
                    <Link href = "/admin"><LinkName active = {page === 'admins' ? 'true' : 'false'}>Admins</LinkName></Link>
                  )}
                  {/* When users click on their profile picture, allow them to view extra options */}
                  <User>
                    <Image onClick = {()=>setUserDash(!userDash)}></Image>
                    <UserSettings display = {userDash.toString()}>
                      <FlexRowWrap onClick = {()=> takeToProfile()}>
                        <Image></Image>
                        <Username>My profile</Username>
                      </FlexRowWrap>
                      <FlexCol>
                        <FlexRowWrap>
                          <TextWrapper>
                            <Link href = "/user/blogs">
                              <Anchor>  
                                <FontAwesomeIcon icon = {faBook}></FontAwesomeIcon>
                                My blogs
                              </Anchor>
                            </Link>
                          </TextWrapper>
                        </FlexRowWrap>
                        <FlexRowWrap>
                          <TextWrapper>
                            <Link href = "/blog/create">
                              <Anchor>
                                <FontAwesomeIcon icon = {faPen}></FontAwesomeIcon>
                                Write new blog
                              </Anchor>
                            </Link>
                          </TextWrapper>
                        </FlexRowWrap>
                        <FlexRowWrap>
                          <TextWrapper>
                            <Link href = "/user/settings">
                              <Anchor>
                                <FontAwesomeIcon icon = {faGears}></FontAwesomeIcon>
                                Settings
                              </Anchor>
                            </Link>
                          </TextWrapper>
                        </FlexRowWrap>
                        <FlexRowWrap>
                          <TextWrapper onClick = {()=> signOut()}>
                            <FontAwesomeIcon icon = {faSignOutAlt}></FontAwesomeIcon>
                            Signout
                          </TextWrapper>
                        </FlexRowWrap>
                      </FlexCol>
                    </UserSettings>
                  </User>
                </>
              :
                <>
                  {/* <Link href = "/about"><LinkName>About</LinkName></Link> */}
                  <Link href = "/user/login"><Button>Get started</Button></Link>
                </>
              }
            </Item>
          </Nav>
          {/* Mobile navigation */}
          <Hamburger onClick = {()=>setMobNav(!mobNav)}>
            <Line></Line>
            <Line></Line>
          </Hamburger>
          {mobNav && (
            <MobNav>
              <MobItems>
                <Link href = "/">
                  <MobLinkName>
                    <FontAwesomeIcon icon = {faHome}></FontAwesomeIcon>
                    Home
                  </MobLinkName>
                </Link>
                <Link href = "/blog/all">
                  <MobLinkName>
                    <FontAwesomeIcon icon = {faBook}></FontAwesomeIcon>
                    Blog
                  </MobLinkName>
                </Link>
                {signed ? 
                  <>
                    <Link href = "/user/bookmarks">
                      <MobLinkName>
                        <FontAwesomeIcon icon = {faRibbon}></FontAwesomeIcon>
                        Bookmarks
                      </MobLinkName>
                    </Link>
                    {user.role === "admin" && (
                      <Link href = "/admin">
                        <MobLinkName>
                          <FontAwesomeIcon icon = {faDashboard}></FontAwesomeIcon>
                          Admins
                        </MobLinkName>
                      </Link>
                    )}
                    <Link href = "/user/profile">
                      <MobLinkName>
                        <FontAwesomeIcon icon = {faUser}></FontAwesomeIcon>
                        Profile
                      </MobLinkName>
                    </Link>
                    <Link href = "/">
                      <MobButton>
                        <FontAwesomeIcon icon = {faSignOut}></FontAwesomeIcon>
                        Signout
                      </MobButton>
                    </Link>
                  </>
                :
                  <>
                  <Link href = "/about">
                      <MobLinkName>
                        <FontAwesomeIcon icon = {faQuestionCircle}></FontAwesomeIcon>
                        About
                      </MobLinkName>
                    </Link>
                    <Link href = "/user/login">
                      <MobButton>
                        <FontAwesomeIcon icon = {faSignIn}></FontAwesomeIcon>
                        Login
                      </MobButton>
                    </Link>
                  </>
                }
              </MobItems>
            </MobNav>
          )}

        </Wrapper>
      </Layout>
    </Container>
  )
}

export default Navbar
