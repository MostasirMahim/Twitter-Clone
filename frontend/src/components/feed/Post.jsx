import { MdKeyboardBackspace } from "react-icons/md";
import {  useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Tweets from "./Tweets";
import LoadingSpinner from "./LoadingSpinner";
import NotFound from "./NotFound";

function Post() {
  const navigate = useNavigate();
  const {id} = useParams();
  const {data :post,error} = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
     try {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      if(!res.ok) return data.error;
      return data;
     } catch (error) {
      console.log(error)
      throw new Error(error);
     }
    }
  })

  const handleGoBack = () => {
    navigate(-1); 
  };
  if(error) {
    return < NotFound />
  }
if (!post) {
		return (
			<LoadingSpinner/>
		);
	}
  return (
    <div>
                <div>
                <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-lg ">
                        <div className="flex m-2 space-x-4">
                            <div onClick={handleGoBack}>
                                <MdKeyboardBackspace className="w-8 h-8 cursor-pointer hover:scale-110 hover:text-sky-500"/>
                            </div>
                            <div>
                             <h4 className="text-start font-bold text-xl ">Post</h4>
                            </div>
                        </div>
                    </div>
              <Tweets post={post}/>
              <div className="space-y-1 bg-gray-700">
              <hr />
              <hr />
              </div>

        { post.comments.map((comment)=> {
          return( <div key={comment._id} className="border-b-[1px] border-gray-700 pl-16">
          <div className="flex flex-start items-center w-full">
          <img src={comment.user.profileImg} alt="profileImg" className="rounded-full h-[40px] w-[40px] m-2 ml-2 cursor-pointer"/>
          <div className="flex-col items-center pb-2 w-full ml-2">
              <span className=" flex justify-start items-center space-x-2 mt-2 cursor-pointer ">
                      <h1 className="hover:text-sky-400 font-semibold">{comment.user.fullname}</h1>
                      <h1 className="hover:text-sky-400 italic">@{comment.user.username}</h1>
                      <h1>1h</h1>
              </span>
          </div>
      </div>
      <div className="w-full h-auto space-y-4 text-left pl-20 mb-4" >
          <p>{comment.text}</p>
      </div>
      </div>)
        })

        }
              </div>
            </div>
  )
}

export default Post
