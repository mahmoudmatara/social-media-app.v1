import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaSpinner, FaKey } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
const passwordSchema = z
  .object({
    password: z.string().nonempty("Current password is required"),
    newPassword: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Must be 8+ characters with uppercase, lowercase, numbers, and symbols."
      )
      .nonempty("New password is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ChangePassword() {
  const { settokenUser } = useContext(AuthContext);
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.patch(
        "https://route-posts.routemisr.com/users/change-password",
        { password: data.password, newPassword: data.newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("UserToken")}`,
          },
        }
      );
    },
    onSuccess: (res) => {
      toast.success("Password updated successfully!");
      const newToken = res.data.data.token || res.data.data.token;
      if (newToken) {
        localStorage.setItem("UserToken", newToken);
        settokenUser(newToken);
        console.log(res.data);
      }
      reset();
      console.log(res);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update password");
      console.log(error);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => mutation.mutate(data);
  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <div className="mx-auto max-w-2xl">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
                <FaKey size={18} />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  Change Password
                </h1>
                <p className="text-sm text-slate-500">
                  Keep your account secure by using a strong password.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <span className="block text-sm font-bold text-slate-700">
                  Current password
                </span>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none transition ${
                    errors.password
                      ? "border-red-500"
                      : "border-slate-200 focus:border-[#1877f2] focus:bg-white"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="block text-sm font-bold text-slate-700">
                  New password
                </span>
                <input
                  {...register("newPassword")}
                  type="password"
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none transition ${
                    errors.newPassword
                      ? "border-red-500"
                      : "border-slate-200 focus:border-[#1877f2] focus:bg-white"
                  }`}
                />
                <p className="text-slate-400 text-xs">
                  At least 8 characters with uppercase, lowercase, number, and
                  special character.
                </p>
                {errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="block text-sm font-bold text-slate-700">
                  Confirm new password
                </span>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  className={`w-full rounded-xl border bg-slate-50 px-3 py-2.5 text-sm outline-none transition ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-slate-200 focus:border-[#1877f2] focus:bg-white"
                  }`}
                />
                {mutation.isSuccess && (
                  <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    Password changed successfully.
                  </div>
                )}{" "}
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!isValid || mutation.isPending}
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mutation.isPending ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  "Update password"
                )}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
