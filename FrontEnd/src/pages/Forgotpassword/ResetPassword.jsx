import { useState } from "react";
import { useLocation } from "react-router";
import { resetPasswordApi } from "../../apis/Api";
// import Bg from "../assets/images/bg2.jpg";
// import Logo from "../assets/images/filmcratebg.png";

export default function ForgotPassword() {
    const location = useLocation();

    // Get the user's email from the previous state
    const userEmail = location.state && location.state.userEmail;

    console.log(userEmail);
    const [password, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleCheckToken = async (e) => {
        e.preventDefault();
        console.log("here")

        try {
            setLoading(true);

            const data = { password, userEmail };
            console.log("hello" + data?.password + data?.userEmail)
            const response = await resetPasswordApi(data);

            if (response.status === 200) {
                setSuccessMessage("Password recovery successful!");
                setError(null);
            } else {
                setError(response.data.error || "Failed to recover password");
                setSuccessMessage(null);
            }
        } catch (error) {
            console.error("Password recovery error:", error);
            setError("An unexpected error occurred");
            setSuccessMessage(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex flex-col md:flex-row bg-[#F6F7D3]">
            <div className="bg-[#F6F7D3] hidden lg:block w-full md:w-1/2 xl:w-2/3">
                {/* <img src={Bg} alt="background" className="w-full h-full object-cover" /> */}
            </div>
            <div className="bg-[#F6F7D3] w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 px-6 lg:px-16 xl:px-12 flex items-center justify-center my-4">
                <div className="w-full h-100">
                    {/* <img src={Logo} alt="Logo" className="relative -left-4" /> */}
                    <h1 className="text-4xl md:text-4xl font-bold leading-tight mt-3 mb-2 texts">
                        Forgot Password?
                    </h1>
                    <h2 className="text-3xl md:text-3xl font-medium leading-tight texts">
                        Recover your password
                    </h2>

                    <form className="mt-3 bg-[#F6F7D3]" action="#" method="POST">
                        {error && <p className="text-pale-red">{error}</p>}
                        {successMessage && (
                            <p className="text-pale-green">{successMessage}</p>
                        )}

                        <div>
                            <label className="block text-[#305973] text-3xl texts">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                value={password}
                                onChange={handleNewPasswordChange}
                                className="border border-gray-400 p-2 rounded-md mb-4"
                            />

                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCheckToken}
                                disabled={loading}
                            >
                                Recover Passw
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
