import { BsTwitterX } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { FaUser } from "react-icons/fa6";
import { FaUserPen } from "react-icons/fa6";
import { MdOutlinePassword } from "react-icons/md";
import { loginModalStyle } from "../../utils/ModalStyles";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoginForm from "./LoginForm";
import Modal from "react-modal";
import LoadingSpinner from "../feed/LoadingSpinner";

function SignUpPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessge] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullname: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const { mutate: signInUser, isPending } = useMutation({
    mutationFn: async ({ email, username, fullname, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, fullname, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("Sign in Succcesfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      setErrorMessge(error.message);
    },
  });

  const onSubmit = () => {
    signInUser(formData);
  };

  const handleSigninClick = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleInputeChenge = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  if (isPending) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex w-screen h-screen">
      <div className="xs:hidden  sm:w-[50%] h-screen flex  justify-center items-center">
        <BsTwitterX className=" w-[300px] h-[300px] " />
      </div>
      <div className="xs:w-[100%] xs:flex xs:flex-col xs:items-center sm:w-[50%] h-full">
        <h1 className="text-4xl mt-16 font-sans font-bold">Join Today.</h1>
        <div>
          <div className="  mt-4 flex border border-gray-800 w-[300px] h-[40px]  pl-2 items-center focus-within:border-sky-500 ">
            <HiOutlineMail className="w-6 h-6 " />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputeChenge}
              id=""
              placeholder="Email"
              className="w-[300px] h-[40px] bg-transparent pl-6 outline-none"
            />
          </div>
          <div className=" mt-4 flex border border-gray-800 w-[300px] h-[40px]  pl-2 items-center focus-within:border-sky-500 ">
            <FaUser className="w-4 h-4 " />
            <input
              type="username"
              name="username"
              value={formData.username}
              onChange={handleInputeChenge}
              id=""
              placeholder="Username"
              className="w-[300px] h-[40px] bg-transparent pl-6 outline-none"
            />
          </div>
          <div className=" mt-4 flex border border-gray-800 w-[300px] h-[40px]  pl-2 items-center focus-within:border-sky-500 ">
            <FaUserPen className="w-6 h-6 " />
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputeChenge}
              id=""
              placeholder="Full Name"
              className="w-[300px] h-[40px] bg-transparent pl-6 outline-none"
            />
          </div>
          <div className=" mt-4 flex border border-gray-800 w-[300px] h-[40px]  pl-2 items-center focus-within:border-sky-500 ">
            <MdOutlinePassword className="w-6 h-6 " />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputeChenge}
              id=""
              placeholder="Password"
              className="w-[300px] h-[40px] bg-transparent pl-6 outline-none"
            />
          </div>
        </div>
        <button
          type="submit"
          onClick={onSubmit}
          className="flex justify-center mt-6 border border-gray-800 rounded-full text-white h-10 font-semibold  w-[280px] items-center space-x-3 text-lg bg-sky-500 hover:bg-sky-600"
        >
          Sign Up
        </button>
        <div>
          {errorMessage && (
            <p className="my-2 text-red-600 pl-16">{errorMessage}</p>
          )}
          <h1 className="w-auto text-lg mt-4 font-sans pl-6 font-semibold">
            Already have an account?
          </h1>
          <button
            onClick={handleSigninClick}
            type="button"
            className="flex justify-center mt-4 border border-sky-500 rounded-full text-blue-600 h-10 font-semibold  w-[280px] items-center space-x-3 text-lg hover:bg-sky-400 hover:text-black"
          >
            Sign in
          </button>
        </div>

        <Modal
          isOpen={isModalVisible}
          onRequestClose={handleCloseModal}
          style={loginModalStyle}
        >
          <LoginForm handleCloseModal={handleCloseModal} />
        </Modal>
      </div>
    </div>
  );
}

export default SignUpPage;
