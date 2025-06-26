import React, { useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../../contexts/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const validation = Yup.object().shape({
  email: Yup.string().required("email is required"),
  username: Yup.string().required("username is required"),
  password: Yup.string().required("password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: Yup.string()
    .oneOf(
      ["Technician", "Engineer", "Operator", "Supervisor"],
      "Please select a valid role"
    )
    .required("Role is required"),
});

const RegisterPage = () => {
  const { register } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(validation) });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (form) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Always use 'USER' role as required by backend
      await register(form.email, form.username, form.password, 'USER');
      toast.success('Registration successful! Please login with your credentials.');
    } catch (error) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      
      if (errorMessage.includes('Email already exists')) {
        toast.error('This email is already registered. Please use a different email or login.');
      } else if (errorMessage.includes('Username already exists')) {
        toast.error('This username is already taken. Please choose a different username.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div className="space-y-4 md:space-y-6 grid grid-cols-12">
                <div className="col-span-12">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...formRegister("username")}
                  />
                  {errors.username ? (
                    <span className="text-red-600">
                      {errors.username?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-12">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...formRegister("email")}
                  />
                  {errors.email ? (
                    <span className="text-red-600">
                      {errors.email?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-12">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    {...formRegister("password")}
                  />
                  {errors.password ? (
                    <span className="text-red-600">
                      {errors.password?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-12">
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="••••••••"
                    {...formRegister("confirmPassword")}
                  />
                  {errors.confirmPassword ? (
                    <span className="text-red-600">
                      {errors.confirmPassword?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-12">
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...formRegister("role")}
                  >
                    <option value="Technician">Technician</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Operator">Operator</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                  {errors.role ? (
                    <span className="text-red-600">
                      {errors.role?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-12">
                  <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(handleRegister)}
            >
              <div className="space-y-4 md:space-y-6 grid grid-cols-12">
                <div className="col-span-12">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...register("username")}
                  />
                  {errors.username ? (
                    <span className="text-red-600">
                      {errors.username?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-12">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    {...register("email")}
                  />
                  {errors.email ? (
                    <span className="text-red-600">
                      {errors.email?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-6 pr-2">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("password")}
                  />
                  {errors.password ? (
                    <span className="text-red-600">
                      {errors.password?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-6 pl-2 ">
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword ? (
                    <span className="text-red-600">
                      {errors.confirmPassword?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor="role"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select your Job Title
                  </label>
                  <select
                    {...register("role")}
                    id="role"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="">Select Role</option>
                    <option value="Technician">Technician</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Operator">Operator</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                  {errors.role ? (
                    <span className="text-red-600">
                      {errors.role?.message}
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full  text-white bg-slate-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-slate-800 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
