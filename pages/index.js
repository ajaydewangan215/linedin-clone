import { AnimatePresence } from 'framer-motion'
import { getSession, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { modalState, modalTypeState } from '../atoms/modalAtom'
import Feed from '../components/Feed'
import Header from '../components/Header'
import Modal from '../components/Modal'
import Sidebar from '../components/Sidebar'
import Widgets from '../components/Widgets'
import { connectToDatabase } from "../util/mongodb"

export default function Home({posts, articles}) {
  const [modalOpen, setModalOpen] = useRecoilState(modalState)
  const [modalType, setModalType] = useRecoilState(modalTypeState)

  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated(){
      router.push("/home")
    }
  });

  return (
    <div className='bg-[#F3F2EF] text-black dark:bg-black dark:text-white h-screen overflow-y-auto md:space-y-6'>
      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className='flex justify-center gap-x-5 px-4 sm:px-12'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* sidebar */}
          <Sidebar/>
          {/* feed */}
          <Feed posts={posts} />
        </div>
        {/* widgets */}
        <Widgets articles={articles} />
        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export async function getServerSideProps(context) {
  // checkif the user is authenticated on the Server...
  const session = await getSession(context)
  if(!session){
    return {
      redirect: {
        permanent:false,
        destination:"/home",
      }, // will be passed to the page component as props
    }
  }

  // Get posts on SSR
  const { db } = await connectToDatabase();
  const posts = await db.collection("posts").find().sort({ timestamp: -1 }).toArray();

  // get GoogleNew Api
  const result = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`).then(res => res.json())

  return {
    props: {
      session,
      articles: result.articles,
      posts: posts.map((post) => ({
        _id: post._id.toString(),
        input: post.input,
        photoUrl: post.photoUrl,
        username: post.username,
        email: post.email,
        userImg: post.userImg,
        createdAt: post.createdAt,
      })),
    }
  }
}
