import React, { useContext, useEffect, useRef, useState } from "react";
import { RiArrowRightSLine } from "@remixicon/react";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/Session";
import { UserContext } from "../App";
import PostAmbient from "../components/PostAmbient";
import LoaderTwo from "../components/LoaderTwo";

const Register = () => {
  const authForm = useRef();
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  useEffect(() => {
    // Focus on the input field when component mounts or showPassword changes
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, [showPassword]);

  const handleToggleCurrentPassword = () => {
    setShowPassword(!showPassword);
  };

  const userAuthThroughServer = (serverRoute, formData, regButton) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
        setEmailMessage(data.message);
        // toast.success(
        //   "Congratulations! 🎉 You're officially part of the community! 🌟 Welcome aboard! 🚀 #RegistrationSuccess"
        // );
        setFormLoading(false);
        regButton.removeAttribute("disabled");
        return toast.success(data.message);
      })
      .catch(({ response }) => {
        setFormLoading(false);
        regButton.removeAttribute("disabled");
        toast.error(response.data.Error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const regButton = e.target;
    let serverRoute = "/api/v1/auth/register";
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    setFormLoading(true);
    regButton.setAttribute("disabled", true);
    //formdata

    let form = new FormData(authForm.current);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullName, email, password } = formData;

    //Form Validation

    if (!email || !password || email === "" || password === "") {
      setFormLoading(false);
      regButton.removeAttribute("disabled");
      return toast.error(
        "Whoops! Looks like you missed filling out some fields! 📝"
      );
    }
    if (!fullName || fullName.length < 3 || fullName === "") {
      setFormLoading(false);
      regButton.removeAttribute("disabled");
      return toast.error(
        "Hey there! Your full name should have more than three letters.📝"
      );
    }
    if (!email || email.length === 0 || email === "") {
      setFormLoading(false);
      regButton.removeAttribute("disabled");
      return toast.error(
        "Hey, don't forget your email! It's required for login. 📧"
      );
    }

    if (!emailRegex.test(email)) {
      setFormLoading(false);
      regButton.removeAttribute("disabled");
      return toast.error(
        "Hold on! Looks like there's an issue with your email. Make sure it's formatted correctly! 📧"
      );
    }

    if (!password || password.length === 0 || password === "") {
      setFormLoading(false);
      regButton.removeAttribute("disabled");
      return toast.error("Password is required 😵");
    }

    if (!passwordRegex.test(password)) {
      setFormLoading(false);
      regButton.removeAttribute("disabled");
      return toast.error(
        "Password🔒 should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter 😵"
      );
    }
    userAuthThroughServer(serverRoute, formData, regButton);
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <>
      {emailMessage && (
        <div className="success-overlay max-md:hidden absolute opacity-0 pointer-events-none top-[-15%] left-0 w-full h-full bg-black/50 z-[1000] backdrop-blur-lg">
          <div className="relative top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
            <div className="w-[100px] h-[100px]">
              <img
                src="https://img.icons8.com/3d-fluency/100/approval.png"
                alt="approval"
              />
            </div>
            <div className="font-candela text-[3vw] text-center">
              {emailMessage}
            </div>
          </div>
        </div>
      )}
      <div className="md:hidden lg:hidden">
        <PostAmbient banner="https://images.unsplash.com/photo-1617147510149-7fbbd5def782?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9yYW5nZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D" />
      </div>
      <div className="login flex justify-center items-center">
        <div className="left w-1/2 h-screen hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1622126812734-35a1d6c46f22?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
            className="object-cover"
          />
        </div>
        <div className="right w-full md:w-1/2 h-screen px-8 py-4">
          <h1 className="font-candela text-[45px] md:text-[50px] lg:text-[5vw]">
            Hey there, buddy! Let's register now{" "}
          </h1>
          <form ref={authForm} action="" className="my-20 email-form">
            <input
              name="fullName"
              type="text"
              placeholder="John Wick"
              className="capitalize mb-5 w-full p-4 bg-transparent border-2 border-[#CA4E00]/30 md:text-xl lg:text-2xl outline-none rounded-2xl focus:border-[#CA4E00] focus:text-[#CA4E00] active:border-[#CA4E00] active:text-[#CA4E00]"
            />
            <input
              name="email"
              type="email"
              placeholder="johnwick@email.com"
              className="lowercase mb-5 w-full p-4 bg-transparent border-2 border-[#CA4E00]/30 md:text-xl lg:text-2xl outline-none rounded-2xl focus:border-[#CA4E00] focus:text-[#CA4E00] active:border-[#CA4E00] active:text-[#CA4E00]"
            />
            <div className="w-full relative">
              <input
                ref={passwordRef}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="●●●●●●●●●●"
                className="mb-5 w-full p-4 bg-transparent border-2 border-[#CA4E00]/30 md:text-xl lg:text-2xl outline-none rounded-2xl focus:border-[#CA4E00] focus:text-[#CA4E00] active:border-[#CA4E00] active:text-[#CA4E00]"
              />
              <div
                className="bg-[#CA4E00]/30 hover:bg-[#CA4E00]/60 absolute right-2.5 top-2.5 md:right-3 md:top-3 w-10 h-10 flex justify-center items-center rounded-xl cursor-pointer"
                onClick={handleToggleCurrentPassword}
              >
                {showPassword ? <Eye size={22} /> : <EyeClosed size={22} />}
              </div>
            </div>
            <button
              className="flex justify-center items-center h-16 font-semibold mb-4 gap-1 text-xl moblieLg:text-2xl md:text-3xl w-full bg-[#CA4E00] rounded-2xl text-black mouseenter"
              type="submit"
              onClick={handleSubmit}
            >
              {formLoading ? "Enlisting... 🚀🎉" : "Register"}
              {formLoading ? <LoaderTwo size={30} color="text-black" /> : ""}
            </button>
            <Link
              to="/login"
              className="w-full md:w-1/2 absolute bottom-10 pr-20 float-right"
            >
              <div className="text-[#CA4E00] w-full hover:underline text-center">
                Already have an account ?
              </div>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
