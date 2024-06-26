import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { showToast } = useAppContext();
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    // useMutation: a hook provided by React Query for server-side mutations like POST, PUT, DELETE requests.
    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");

            showToast({message: "User registered successfully!", type: "SUCCESS"});
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        }
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an Account</h2>
            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName", {required: "First Name is required"})}></input>
                    {errors.firstName && (<span className="text-red-500">{errors.firstName.message}</span>)}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal" {...register("lastName", {required: "Last Name is required"})}></input>
                    {errors.lastName && (<span className="text-red-500">{errors.lastName.message}</span>)}
                </label>
            </div>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input type="email" className="border rounded w-full py-1 px-2 font-normal" {...register("email", {required: "Email is required"})}></input>
                {errors.email && (<span className="text-red-500">{errors.email.message}</span>)}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input type="password" className="border rounded w-full py-1 px-2 font-normal" {...register("password", {required: "Password is required", minLength: {value: 6, message: "Password must be at least 6 characters"}})}></input>
                {errors.password && (<span className="text-red-500">{errors.password.message}</span>)}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input type="password" className="border rounded w-full py-1 px-2 font-normal" 
                    {
                        ...register("confirmPassword", 
                        {
                            validate:(value) => {
                                if(!value) {
                                    return "Conrim Password is required";
                                } else if(watch("password") != value) {
                                    return "Your passwords do not match";
                                }
                            }
                        })
                    }
                ></input>
                {errors.confirmPassword && (<span className="text-red-500">{errors.confirmPassword.message}</span>)}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    You already have an account? <Link to="/sign-in" className="underline">Sign in</Link>
                </span>
                <button type="submit" className="bg-sky-700 text-white p-2 font-bold hover:bg-sky-600 text-xl">Create Account</button>
            </span>
        </form>
    )
}

export default Register;