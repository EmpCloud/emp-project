import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import validate from "validate.js";
import { resetPasswordAdmin } from "../api/post";
import { FloatingPasswordTextfield } from "@COMPONENTS/FloatingPasswordTextfield";
import { displayErrorMessage } from "@HELPER/function";
import { passwordSchema, confirmPasswordSchema } from "@HELPER/schema";
import toast from "@COMPONENTS/Toster/index";
export const Index = ({ startLoading, stopLoading }) => {
  const router = useRouter();
  const { query } = useRouter();
  const initialState = {
    isValid: false,
    values: {},
    touched: {},
    errors: { password: null },
  };
  const schema = {
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  };
  const [formState, setFormState] = useState({ ...initialState });
  useEffect(() => {}, [query]);
  useEffect(() => {
    const errors = validate(formState.values, schema);
    setFormState((prevFormState) => ({
      ...prevFormState,
      isValid: !errors,
      errors: errors || {},
    }));
  }, [formState.values, formState.isValid]);
  useEffect(() => {
    // document.querySelector("body").classList.add("bg-slate-50");
  }, []);
  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };
  const hasError = (field) =>
    !!(formState.touched[field] && formState.errors[field]);
  const handleSumbmit = (e) => {
    e.preventDefault();
    startLoading();
    resetPasswordAdmin({
      email: query.userMail,
      token: query.activationLink,
      newPassword: formState.values.password,
    }).then((response) => {
      if (response.data.statusCode == 200) {
        toast({
          type: "success",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
      } else {
        toast({
          type: "error",
          message: response
            ? response.data.body.message
            : "Something went wrong, Try again !",
        });
        stopLoading();
      }
      setTimeout(() => {
        router.push("/w-m/admin/sign-in");
      }, 2000);
    });
    stopLoading();
  };
  const [visibility, setVisibility] = useState({
    password: false,
    confirmPassword: false,
  });
  const handleClickShowPassword = () => {
    setVisibility({ ...visibility, password: !visibility.password });
  };
  const handleClickShowConfirmPassword = () => {
    setVisibility({
      ...visibility,
      confirmPassword: !visibility.confirmPassword,
    });
  };
  return (
    <div className="font-inter bg-slate-50">
      <section className="mx-auto">
        <div className="flex place-content-center mt-8">
          <img className="w-48" src="/imgs/logo.jpg" alt="EmpMonitor" />
        </div>
      </section>
      <section className=" mx-auto flex justify-center">
        {/*-- container -- */}
        <div className="block place-content-center m-6 mb-20 w-[500px]  drop-shadow-xl  bg-white rounded-xl p-10">
          <h2 className="text-left text-defaultTextColor font-bold text-2xl">
            Reset password
          </h2>
          <form onSubmit={handleSumbmit}>
            <div className="mt-8">
              <div className="wrapper relative">
                <FloatingPasswordTextfield
                  name="password"
                  state={visibility.password}
                  label={"Your password"}
                  value={formState.values.password || ""}
                  onClick={handleClickShowPassword}
                  onChange={handleChange}
                  error={hasError("password")}
                  errorMsg={displayErrorMessage(formState.errors.password)}
                />
              </div>
              <div className="wrapper relative mt-5">
                <FloatingPasswordTextfield
                  name="confirmPassword"
                  state={visibility.confirmPassword}
                  label={"Confirm password"}
                  value={formState.values.confirmPassword || ""}
                  onClick={handleClickShowConfirmPassword}
                  onChange={handleChange}
                  error={hasError("confirmPassword")}
                  errorMsg={displayErrorMessage(
                    formState.errors.confirmPassword
                  )}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-8 button"
              disabled={!formState.isValid}
            >
              Reset Password
            </button>
            <div className="text-center mt-10">
              <p className="text-defaultTextColor">
                back to account?
                <a
                  onClick={() => router.push("/w-m/admin/sign-in")}
                  className="text-brandBlue hover:text-lightBlue transition-all cursor-pointer"
                >
                  {" "}
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Index;
