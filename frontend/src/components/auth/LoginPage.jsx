import { BsTwitterX } from "react-icons/bs";
import { useState } from "react";
import { loginModalStyle } from "../../utils/ModalStyles";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import GoogleSignIn from "./GoogleSignIn";
import LoginForm from "./LoginForm";
import googleIcon from "../../assets/google.svg";

function LoginPage() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLoginClick = () => {
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div>
      <div className=" w-screen h-screen flex">
        <div className="w-[50%] xs:hidden h-screen flex justify-center items-center">
          <BsTwitterX className="w-[300px] h-[300px]" />
        </div>
        <div className="xs:w-full xs:flex xs:flex-col xs:items-center sm:w-[50%] h-full">
          <h1 className="xs:text-4xl sm:text-4xl xl:text-7xl mt-16  font-sans font-bold">
            Happening now
          </h1>
          <h1 className="xs:text-2xl sm:text-2xl xl:text-4xl xs:mt-8 sm:mt-8 xl:mt-12  font-sans font-bold">
            Join Today.
          </h1>
          <div>
            <div className="flex justify-center xs:mt-4 sm:mt-4 xl:mt-10 border border-gray-800 rounded-full text-black h-10 font-semibold  w-[280px] items-center space-x-3 text-lg bg-white hover:bg-sky-300">
              <img src={googleIcon} alt="Google Icon" className="w-8 h-8" />
              <GoogleSignIn />
            </div>
            <div className=" pl-6 flex justify-start items-baseline space-x-2">
              <div className=" w-24 h-1 border-t-2 border-gray-700"></div>
              <h1 className="text-gray-300">or</h1>
              <div className=" w-24 h-1 border-t-2 border-gray-700"></div>
            </div>
            <button
              onClick={handleSignup}
              className="mt-2 border border-gray-800 rounded-full text-black h-10 font-semibold  w-[280px] text-lg bg-sky-500  hover:bg-sky-600"
            >
              Create account
            </button>
            <h1 className="h-10 mt-2 text-slate-400 text-[12px] w-[300px]">
              By signing up, you agree to the{" "}
              <span className="text-blue-700">Terms of Service</span> and{" "}
              <span className="text-blue-700">Privacy Policy</span>, including{" "}
              <span className="text-blue-700">Cookie</span> Use.
            </h1>

            <h1 className="  text-lg pl-8 xs:mt-2 sm:mt-6 font-sans sm:pl-6 font-semibold">
              Already have an account?
            </h1>
            <button
              type="button"
              className="mt-2 border border-sky-500 rounded-full text-blue-600 h-10 font-semibold sm:w-[280px]  text-lg  hover:bg-sky-400 hover:text-black"
              onClick={handleLoginClick}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalVisible}
        onRequestClose={handleCloseModal}
        style={loginModalStyle}
      >
        <LoginForm handleCloseModal={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default LoginPage;
