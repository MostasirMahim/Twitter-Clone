import { HiOutlineMail } from "react-icons/hi";
import { MdOutlinePassword } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
const LoginForm = ({ handleCloseModal }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessge] = useState("");

  const queryClient = useQueryClient();
  const { mutate: loginUser } = useMutation({
    mutationFn: async ({ email, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }
      console.log(result.error);
      return result;
    },
    onSuccess: () => {
      toast.success("logged in Succcesfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      setErrorMessge(error.message);
    },
  });

  const onSubmitLogin = () => {
    loginUser(formData);
  };
  const handleInputChange = (e) => {
    //need concept clear
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative">
      <GiCancel
        className="absolute top-0 right-0 w-6 h-6 mr-2 mt-2 hover:cursor-pointer hover:text-sky-500"
        onClick={handleCloseModal}
      />
      <div className="m-12">
        <div className="flex border border-gray-800 w-[300px] h-[40px]  pl-2 items-center focus-within:border-sky-500 ">
          <HiOutlineMail className="w-6 h-6 " />
          <input
            type="email"
            name="email"
            onChange={handleInputChange}
            value={formData.email}
            id="loginemail"
            placeholder="Email"
            className="w-[300px] h-[40px] bg-transparent pl-6 outline-none"
          />
        </div>
        <div className="mt-4 flex border border-gray-800 w-[300px] h-[40px]  pl-2 items-center focus-within:border-sky-500 ">
          <MdOutlinePassword className="w-6 h-6 " />
          <input
            type="password"
            name="password"
            id="loginpassword"
            placeholder="Password"
            onChange={handleInputChange}
            value={formData.password}
            className="w-[300px] h-[40px] bg-transparent pl-6 outline-none"
          />
        </div>
        <button
          type="submit"
          onClick={(e) => {
            onSubmitLogin(e);
          }}
          className="flex justify-center mt-6 border border-gray-800 rounded-full text-white h-10 font-semibold  w-[280px] items-center space-x-3 text-lg bg-sky-500 hover:bg-sky-600"
        >
          Log In{" "}
        </button>
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
