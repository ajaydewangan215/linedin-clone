import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { handlePostState, useSSRPostsState } from '../atoms/postAtom'
import Input from './Input'
import Posts from './Posts'

const Feed = ({ posts }) => {
  const [realtimePosts , setRealtimePosts] = useState([])
  const [handlePost, setHandlePost] = useRecoilState(handlePostState)
  const [useSSRPosts, setUseSSRPosts] = useRecoilState(useSSRPostsState)

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        method: "GET",
        headers: { "Content-Type": "application/json"}
      });
      const responseData = await response.json();
      setRealtimePosts(responseData)
      setHandlePost(false)
      setUseSSRPosts(false)
    }
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePost])

  return (
    <div className="space-y-6 pb-24 max-w-lg">
      <Input />
      {/* Post */}
      {!useSSRPosts 
        ? realtimePosts.map(post => <Posts key={post._id} post={post} />) 
        : posts.map(post => <Posts key={post._id} post={post} />)
      }
    </div>
  )
}

export default Feed