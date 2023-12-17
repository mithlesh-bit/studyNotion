import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints

export function sendOtp(email, navigate) {
  console.log("sendotp Function called");
  console.log(email);
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      console.log("SENDOTP API is now called............")

      const response = await fetch('http://localhost:4000/api/v1/auth/sendotp', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          checkUserPresent: true,
        }),
        headers: {
          'Content-Type': 'application/json'
        }

      })
      if (response.ok) {
        const data = await response.json()
        console.log(data);
        toast.success("OTP Sent Successfully")
      }
      // const response = await apiConnector("POST", SENDOTP_API, {
      //   email,
      //   checkUserPresent: true,
      // })
      // console.log("SENDOTP API RESPONSE............", response)

      // console.log(response.data.success)

      // if (!response.data.success) {
      //   throw new Error(response.data.message)
      // }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(

  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  console.log("called signup");

  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      // const response = await apiConnector("POST", 'http://localhost:4000/api/v1/auth/signup', {
      //   accountType,
      //   firstName,
      //   lastName,
      //   email,
      //   password,
      //   confirmPassword,
      //   otp,
      // })

      const response = await fetch('http://localhost:4000/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          accountType,
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          otp,
          checkUserPresent: true,
        }),
        headers: {
          'Content-Type': 'application/json'
        }

      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.ok) {
        console.log(response.data.message);
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  console.log("called login");
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      //   const response = await apiConnector("POST", LOGIN_API, {
      //     email,
      //     password,
      //   })
      console.log("sahi jaa rha hai");
      const response = await fetch('http://localhost:4000/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          'Content-Type': 'application/json'
        }

      })

      const responseData = await response.json(); // Extract JSON from the response
      console.log("LOGIN API RESPONSE............", responseData)

      if (!response.ok) {
        throw new Error(response.data.message)
      }

      // console.log(222222222, responseData.token);

      toast.success("Login Successful")
      dispatch(setToken(responseData.token))
      const userImage = responseData.user?.image
        ? responseData.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${responseData.user.firstName} ${responseData.user.lastName}`
      dispatch(setUser({ ...responseData.user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(responseData.token))
      localStorage.setItem("user", JSON.stringify(responseData.user))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  // console.log(11111111111);
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/reset-password-token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      console.log('RESET PASSWORD TOKEN RESPONSE....', data);

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success('Reset Email Sent');
      setEmailSent(true);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Failed to send email for resetting password');
    }

    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/reset-password", { password, confirmPassword, token });

      console.log("RESET Password RESPONSE ... ", response);


      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch (error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}