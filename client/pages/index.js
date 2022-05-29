import Head from 'next/head'
import tw from 'tailwind-styled-components/dist/tailwind'
import { Editorspicks, Hero, LatestArticles, Navbar } from '../components'
import { verify, decode } from 'jsonwebtoken'

const Container = tw.section`
w-[100vw]
h-full
bg-gray-100
overflow-hidden
`

export default function Home({user, logged,featured}) {
  return (
    <Container>
      <Navbar signed = {logged} user = {user} page = "home"/>
      <Hero featured = {featured}/>
      {/* <LatestArticles/>
      <Editorspicks/> */}
    </Container>
  )
}

export async function getServerSideProps({req,res}) {
  const jwt = req.cookies.userToken || null
    try{
        verify(jwt, process.env.JWT_SECRET)
        const blogRes = await fetch(`http://localhost:4001/blog/38`)
        const blogData = await blogRes.json()
        return{props: {user:decode(jwt),logged:true, featured: blogData.data}}
    }catch(e){
        const blogRes = await fetch(`http://localhost:4001/blog/38`)
        const blogData = await blogRes.json()
        return {props:{logged:false, featured:blogData.data}}
    }
}
