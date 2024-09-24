import { CiImageOn } from "react-icons/ci";
import { MdOutlineGifBox } from "react-icons/md";
import { BiPoll } from "react-icons/bi";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineCancel } from "react-icons/md";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function CreatePostMenu() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const navigate = useNavigate();
  const imgRef = useRef(null);
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["authUser"] });

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || "something is wrong");
        }
        return result;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setImg(null);
      setText("");
      toast.success("Post created Succcesfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const imgUploader = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);

        if (imgRef.current) {
          imgRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelIcon = () => {
    setImg(null);
    if (imgRef.current) {
      imgRef.current.value = null;
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-auto ">
        <div className="flex justify-start ml-2 ">
          <div onClick={() => navigate(`/profile/${data.username}`)}>
            <img
              src={data.profileImg}
              alt="profileImg"
              className="cursor-pointer rounded-full h-[40px] w-[40px] m-2 "
            />
          </div>
          <div className="w-full ml-2 pt-2 space-y-6 ">
            <textarea
              name="post"
              rows="1"
              placeholder="What's happening?"
              id=""
              value={text}
              onChange={(e) => setText(e.target.value)}
              onInput={(e) => {
                e.target.style.height = "auto"; // Reset the height
                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
              }}
              className="bg-black text-white-600  rounded-lg p-2 focus:outline-none   text-lg w-full leading-tight placeholder-gray-500 resize-none overflow-hidden"
            ></textarea>
            {img && (
              <div>
                <MdOutlineCancel
                  onClick={cancelIcon}
                  className="h-6 w-6 ml-[80%] my-2 text-gray-500"
                />
                <img src={img} className="h-auto w-[80%]"></img>
              </div>
            )}
            <div className="flex h-30 justify-between -space-y-2 border-b-[1px] border-gray-700 pb-2">
              <div className=" flex space-x-3">
                <CiImageOn
                  onClick={() => imgRef.current.click()}
                  className=" text-sky-400 w-6 h-6 cursor-pointer hover:scale-110 hover:text-blue-600"
                />
                <MdOutlineGifBox className=" text-sky-400 w-6 h-6 cursor-pointer hover:scale-110 hover:text-blue-600" />
                <BiPoll className=" text-sky-400 w-6 h-6 cursor-pointer hover:scale-110 hover:text-blue-600" />
                <BsEmojiSmile className=" text-sky-400 w-6 h-6 cursor-pointer hover:scale-110 hover:text-blue-600" />
                <RiCalendarScheduleFill className=" text-sky-400 w-6 h-6 cursor-pointer hover:scale-110 hover:text-blue-600" />
              </div>
              <input type="file" hidden ref={imgRef} onChange={imgUploader} />
              <div
                onClick={handleSubmit}
                className=" w-20 h-8 bg-sky-400 rounded-full flex items-center justify-center font-semibold mr-5 hover:bg-blue-600 cursor-pointer hover:cursor-pointer"
              >
                {isPending ? "Posting.." : "Post"}
              </div>
            </div>
            {isError && <div className="text-red-500">{error.message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePostMenu;
