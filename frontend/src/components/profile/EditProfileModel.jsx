/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { MdAddPhotoAlternate } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function EditProfileModel({ handleCloseModal, user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    Location: "",
    DateOfBirth: "",
    Bio: "",
    link: "",
    newPassword: "",
    oldPassword: "",
    coverImg: "",
    profileImg: "",
  });
  const queryClient = useQueryClient();
  const [dob, setDob] = useState(false);
  const profileImgRef = useRef(null);
  const coverImgRef = useRef(null);

  console.log(user);
  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/users/update/${user._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) return data.error || "update problem";
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      navigate(`/profile/${user.username}`);

      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["user"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const imgUploader = (e, type) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "profile") {
          setFormData({ ...formData, profileImg: reader.result });
        } else if (type === "cover") {
          setFormData({ ...formData, coverImg: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  if (!user) return null;
  return (
    <div className="mx-4 md:relative xs:w-screan md:max-w-full">
      <div className="flex justify-between sticky top-0 z-10 bg-black items-center">
        <div className="flex items-center justify-start mt-2 mb-2 space-x-6 ">
          <RxCross1
            className=" w-4 h-4 mt-2 hover:cursor-pointer hover:text-sky-500"
            onClick={handleCloseModal}
          />
          <h1 className="flex justify-center text-lg">Edit profile</h1>
        </div>
        <div>
          <button
            form="EditForm"
            type="submit"
            className="flex justify-center items-center  border border-gray-800 rounded-full text-white h-8 font-semibold  w-[80px]  space-x-3 text-lg bg-sky-500 hover:bg-sky-600"
          >
            {isPending ? "saving.." : "save"}
          </button>
        </div>
      </div>

      <form
        id="EditForm"
        onSubmit={(e) => {
          e.preventDefault();
          updateUser();
        }}
      >
        <div className=" md:relative bg-transparent">
          <div className="relative">
            <img
              src={formData.coverImg || user.coverImg}
              alt="coverImg"
              className="w-full h-[200px] object-cover"
            />

            <MdAddPhotoAlternate
              onClick={() => coverImgRef.current.click()}
              className="absolute top-1/2 left-1/2   bg-[#4d4d4d] hover:bg-slate-300 hover:text-black w-10 h-10  p-1 border rounded-full border-black"
            />
          </div>
          <input
            type="file"
            hidden
            ref={coverImgRef}
            onChange={(e) => imgUploader(e, "cover")}
          />
          <div className="relative ">
            <img
              src={formData.profileImg || user.profileImg}
              alt="profileImg"
              className="w-36 h-36 object-cover rounded-full absolute bottom-0 left-4 transform  translate-y-1/2 border-4 border-black"
            />
            <MdAddPhotoAlternate
              onClick={() => profileImgRef.current.click()}
              className="absolute -top-[15px] left-[68px] bg-[#4d4d4d] hover:bg-slate-300 hover:text-black w-10 h-10  p-1 border rounded-full border-black"
            />
          </div>
          <input
            type="file"
            hidden
            ref={profileImgRef}
            onChange={(e) => imgUploader(e, "profile")}
          />
          <div className=" md:ml-6 mt-24 flex-col border-2 rounded-xl border-gray-800 md:w-[600px] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
            <div className="flex justify-between">
              <h1 className="text-center justify-start flex ">Name</h1>
              <h1 className="text-center justify-start flex mr-2">
                {formData.fullname.length}/50
              </h1>
            </div>
            <input
              type="text"
              name="fullname"
              placeholder={user.fullname}
              maxLength={50}
              value={formData.fullname}
              onChange={handleInputChange}
              className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
            />
          </div>
          <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800 md:w-[600px] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
            <div className="flex justify-between">
              <h1 className="text-center justify-start flex ">Username</h1>
              <h1 className="text-center justify-start flex mr-2">
                {formData.username.length}/50
              </h1>
            </div>
            <input
              type="text"
              name="username"
              placeholder={user.username}
              maxLength={50}
              value={formData.username}
              onChange={handleInputChange}
              className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
            />
          </div>
          <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800 md:w-[600px] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
            <div className="flex justify-between">
              <h1 className="text-center justify-start flex ">Email</h1>
              <h1 className="text-center justify-start flex mr-2">
                {formData.email.length}/50
              </h1>
            </div>
            <input
              type="email"
              name="email"
              placeholder={user.email}
              maxLength={50}
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
            />
          </div>

          <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800 md:w-[600px] h-[100px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
            <div className="flex justify-between">
              <h1 className="text-center justify-start flex ">Bio</h1>
              <h1 className="text-center justify-start flex mr-2">
                {formData.Bio.length}/100
              </h1>
            </div>
            <input
              type="text"
              name="Bio"
              placeholder={user.Bio}
              maxLength={100}
              value={formData.Bio}
              onChange={handleInputChange}
              className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
            />
          </div>

          <div className="md:flex">
            <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800  md:w-[45%] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
              <h1 className="text-center justify-start flex ">
                Current Password
              </h1>
              <input
                type="password"
                name="oldPassword"
                maxLength={30}
                value={formData.oldPassword}
                onChange={handleInputChange}
                className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
              />
            </div>

            <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800  md:w-[45%] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
              <h1 className="text-center justify-start flex ">New Password</h1>
              <input
                type="password"
                name="newPassword"
                maxLength={50}
                value={formData.newPassword}
                onChange={handleInputChange}
                id=""
                className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
              />
            </div>
          </div>
          <div>
            <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800  md:w-[600px] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
              <div className="flex justify-between">
                <h1 className="text-center justify-start flex ">Location</h1>
                <h1 className="text-center justify-start flex mr-2">
                  {formData.Location.length}/30
                </h1>
              </div>
              <input
                type="text"
                name="Location"
                placeholder={user.Location}
                maxLength={30}
                value={formData.Location}
                onChange={handleInputChange}
                className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
              />
            </div>

            <div className=" md:ml-6 mt-6 flex-col border-2 rounded-xl border-gray-800 md:w-[600px] h-[59px]  pl-2  -space-y-2 pb-2 text-gray-500 focus-within:border-sky-500 focus-within:text-sky-400">
              <div className="flex justify-between">
                <h1 className="text-center justify-start flex ">Website</h1>
                <h1 className="text-center justify-start flex mr-2">
                  {formData.link.length}/50
                </h1>
              </div>
              <input
                type="text"
                name="website"
                placeholder={user.link}
                maxLength={50}
                value={formData.link}
                onChange={handleInputChange}
                className="w-full h-[40px] bg-transparent  outline-none text-xl  text-white"
              />
            </div>
          </div>

          <div className="ml-6 mt-4 mb-16 text-xl font-semibold text-gray-300 ">
            <p className="flex items-start text-lg text-gray-600">
              Birth date ~{" "}
              <span
                className="underline text-sky-500"
                onClick={() => setDob(true)}
              >
                {" "}
                edit
              </span>
            </p>
            <h1 className="flex items-start text-sky-400">
              {user.DateOfBirth}
            </h1>

            {dob && (
              <div className="flex justify-start mt-4">
                <input
                  type="date"
                  name="DateOfBirth"
                  onChange={handleInputChange}
                  className="bg-slate-500 text-black font-serif text-lg italic "
                ></input>
                <div onClick={() => setDob(false)}>
                  <RxCross1 className="w-4 h-4" />
                </div>
                <button
                  type="submit"
                  value={formData.DateOfBirth}
                  form="EditForm"
                  className="ml-4 rounded-full text-white h-8 font-semibold  w-[100px] items-center space-x-3 text-lg bg-sky-500 hover:bg-sky-600 "
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProfileModel;
