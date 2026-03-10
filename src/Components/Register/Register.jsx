import React, { useContext } from "react";
import {
  FaCommentAlt,
  FaImage,
  FaBell,
  FaUsers,
  FaStar,
  FaHeart,
  FaFacebookF,
  FaUser,
  FaVenusMars,
  FaCalendarAlt,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiArrowRight,
} from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import alex from "../../assets/alex.png";
import bg from "../../assets/bg.png";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { email } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AuthContext } from "./../../Context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setapiError] = useState(null);
  const [loading, setloading] = useState(false);

  const schema = z
    .object({
      name: z
        .string()
        .nonempty("invalid full name")
        .min(3, "minlength must be 3 chars")
        .max(15, "maxlength must be 15 chars"),

      email: z
        .email("invalid email")
        .regex(/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, "not match with pattern")
        .nonempty("email is required"),

      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Must be 8+ characters with uppercase, lowercase, numbers, and symbols."
        )
        .nonempty("password is required"),

      rePassword: z.string().nonempty("repassword is required"),

      dateOfBirth: z.string().refine((date) => {
        const userDate = new Date(date);
        const currentDate = new Date();

        return currentDate.getFullYear() - userDate.getFullYear() >= 18; //refine return true or false
      }, "Invalid date..."),

      gender: z.enum(["male", "female"]),
    })
    .refine(
      (object) => {
        return object.password === object.rePassword;
      },
      {
        error: "password & confirmation password not matched !",
        path: ["rePassword"],
      }
    );

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { settokenUser, setuserData } = useContext(AuthContext);

  function registerSubmit(data) {
    setloading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, data)
      .then((respo) => {
        if (respo.data.success === true) {
          const token = respo.data.token;
          const user = respo.data.data.user;
          localStorage.setItem("UserToken", token);
          settokenUser(token);

          localStorage.setItem("UserData", JSON.stringify(user));
          setuserData(user);

          toast.success("Account created and data saved!");
          setloading(false);
          setTimeout(() => navigate("/home"), 2000);
        }
      })
      .catch((err) => {
        setapiError(err.response?.data?.message);
        setloading(false);
      });
  }

  const { register, handleSubmit, formState, touchedFields } = form;
  const { errors, isValid } = formState;

  return (
    <div className="grid lg:grid-cols-2 min-h-screen w-full font-sans antialiased">
      <Toaster position="top-right" reverseOrder={false} />
      <div
        className="signup-hero text-white flex flex-col justify-between p-10 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(20, 71, 230, 0.85), rgba(20, 71, 230, 0.85)), url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <header className="relative z-10">
          <h1>
            <a className="flex items-center gap-3" href="/">
              <span className="size-12 text-lg font-bold flex justify-center items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-lg">
                S
              </span>
              <span className="text-2xl font-bold tracking-tight">
                SocialHub
              </span>
            </a>
          </h1>
        </header>

        <div className="content space-y-8 relative z-10">
          <div className="title">
            <h2 className="text-5xl font-bold max-w-lg">
              Conncet width
              <br />
              <span className="text-cyan-300">amazing people</span>
            </h2>
            <p className="max-w-md text-white pt-3">
              Join millions of users sharing moments, ideas, and building
              meaningful connections every day
            </p>
          </div>

          <section className="feature-section ">
            <ul className="feature-cards grid lg:grid-cols-2 gap-4">
              <li className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 hover:scale-105 transition-transform duration-200">
                <div className="icon size-10 flex justify-center items-center rounded-xl bg-teal-400/20 text-green-300">
                  <FaCommentAlt size={20} />
                </div>
                <div className="card-body">
                  <h4 className="font-semibold">Real-time Chat</h4>
                  <span className="text-sm opacity-80">Instant messaging</span>
                </div>
              </li>
              <li className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 hover:scale-105 transition-transform duration-200">
                <div className="icon size-10 flex justify-center items-center rounded-xl bg-blue-400/20 text-blue-100">
                  <FaImage size={20} />
                </div>
                <div className="card-body">
                  <h4 className="font-semibold">Share Media</h4>
                  <span className="text-sm opacity-80">Photos & videos</span>
                </div>
              </li>
              <li className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 hover:scale-105 transition-transform duration-200">
                <div className="icon size-10 flex justify-center items-center rounded-xl bg-pink-400/20 text-pink-100">
                  <FaBell size={20} />
                </div>
                <div className="card-body">
                  <h4 className="font-semibold">Smart Alerts</h4>
                  <span className="text-sm opacity-80">Stay updated</span>
                </div>
              </li>
              <li className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 hover:scale-105 transition-transform duration-200">
                <div className="icon size-10 flex justify-center items-center rounded-xl bg-teal-400/20 text-green-300">
                  <FaUsers size={20} />
                </div>
                <div className="card-body">
                  <h4 className="font-semibold">Communities</h4>
                  <span className="text-sm opacity-80">Find your tribe</span>
                </div>
              </li>
            </ul>
          </section>

          <section>
            <ul className="flex flex-wrap items-center gap-8 mb-1">
              <li>
                <div className="flex gap-2 items-center">
                  <FaUsers className="text-white text-2xl" />
                  <span className="text-2xl font-black">2M+</span>
                </div>
                <p className="text-base text-white font-medium">Active Users</p>
              </li>
              <li>
                <div className="flex gap-2 items-center">
                  <FaHeart className="text-white" />
                  <span className="text-2xl font-black">10M+</span>
                </div>
                <p className="text-base text-white font-medium">Posts Shared</p>
              </li>
              <li>
                <div className="flex gap-2 items-center">
                  <FaCommentAlt className="text-white" />
                  <span className="text-2xl font-black">50M+</span>
                </div>
                <p className="text-base text-white font-medium">
                  Messages Sent
                </p>
              </li>
            </ul>
          </section>
        </div>

        <figure className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-4xl p-6 space-y-4 hover:bg-white/15 transition-all duration-300 relative z-10 shadow-2xl">
          <div className="rating-average text-yellow-300 flex gap-1">
            <FaStar className="w-5 h-5" />
            <FaStar className="w-5 h-5" />
            <FaStar className="w-5 h-5" />
            <FaStar className="w-5 h-5" />
            <FaStar className="w-5 h-5" />
          </div>
          <blockquote className="text-lg italic leading-relaxed">
            <p>
              "SocialHub has completely changed how I connect with friends and
              discover new communities. The experience is seamless!"
            </p>
          </blockquote>

          <figcaption className="author flex items-center gap-3">
            <img
              className="size-12 rounded-full border-2 border-white/30"
              alt="Alex"
              src={alex}
            />
            <div className="info flex flex-col">
              <cite className="not-italic font-bold">Alex Johnson</cite>
              <span className="text-sm text-blue-200/80">Product Designer</span>
            </div>
          </figcaption>
        </figure>
      </div>

      <div className="login-form bg-slate-50 py-6 px-6 flex justify-center items-center">
        <form
          onSubmit={handleSubmit(registerSubmit)}
          className="w-full bg-white max-w-lg p-10 md:p-9 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 space-y-8 border border-slate-200"
        >
          <header className="text-center space-y-3">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">
              Create account
            </h2>
            <p className="text-slate-500 font-medium">
              Already have an account?{" "}
              <NavLink
                className="text-blue-600 font-bold hover:underline"
                to={"/login"}
              >
                Sign up
              </NavLink>
            </p>
          </header>

          <div className="social-btns grid grid-cols-2 gap-4">
            <button
              type="button"
              className="cursor-pointer flex items-center justify-center gap-3 py-3 border-2 border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
            >
              <FcGoogle className="w-5 h-5" />
              <span>Google</span>
            </button>

            <button
              type="button"
              className="cursor-pointer flex items-center justify-center gap-3 py-3 bg-[#1877F2] rounded-2xl font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <FaFacebookF className="w-5 h-5" />
              <span>Facebook</span>
            </button>
          </div>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative bg-white px-2 text-base text-slate-400">
              or continue with email
            </span>
          </div>

          <div className="form-controls space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  {...register("name")}
                  placeholder="Enter Your Full Name"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-6 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  id="name"
                  type="text"
                />
                <FaUser className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {formState.touchedFields.name && formState.errors.name && (
                <p className="text-red-600 p-1 m-2 rounded-sm font-bold">
                  {formState.errors.name?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-6 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  id="email"
                  type="email"
                />
                <HiOutlineMail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {formState.touchedFields.email && formState.errors.email && (
                <p className="text-red-600 p-1 m-2 rounded-sm font-bold">
                  {formState.errors.email?.message}
                </p>
              )}
              {apiError && (
                <p className="text-red-500 font-bold p-1">*{apiError}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  placeholder="Create a strong password"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-6 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  id="password"
                  type="password"
                />
                <HiOutlineLockClosed className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {formState.touchedFields.password &&
                formState.errors.password && (
                  <p className="text-red-600 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.password?.message}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="rePassword"
                className="text-sm font-bold text-slate-700 ml-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register("rePassword")}
                  placeholder="Confirm Your Password"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50/50 py-4 pl-12 pr-6 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                  id="rePassword"
                  type="password"
                />
                <HiOutlineLockClosed className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              {formState.touchedFields.rePassword &&
                formState.errors.rePassword && (
                  <p className="text-red-600 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.rePassword?.message}
                  </p>
                )}
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Date Of Birth
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register("dateOfBirth")}
                    type="date"
                    placeholder="mm/dd/yyyy"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {formState.touchedFields.dateOfBirth &&
                  formState.errors.dateOfBirth && (
                    <p className="text-red-600 p-1 m-2 rounded-sm font-bold">
                      {formState.errors.dateOfBirth?.message}
                    </p>
                  )}
              </div>
              <div className="flex flex-col w-1/2">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="relative">
                  <FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    {...register("gender")}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select your gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                {formState.touchedFields.gender && formState.errors.gender && (
                  <p className="text-red-600 p-1 m-2 rounded-sm font-bold">
                    {formState.errors.gender?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            disabled={!isValid || loading}
            type="submit"
            className="cursor-pointer w-full py-3 disabled:cursor-not-allowed  disabled:bg-slate-500 bg-blue-600 text-white rounded-2xl font-black text-base shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
          >
            <span>Create Account</span>
            <HiArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
