import { toast } from "react-hot-toast"

import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/profile/updateDisplayPicture",
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Set the form data directly as the body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update display picture");
      }

      const responseData = await response.json();

      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        responseData
      );

      if (!responseData.success) {
        throw new Error(responseData.message);
      }

      toast.success("Display Picture Updated Successfully");
      dispatch(setUser(responseData.data));
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error);
      toast.error("Could Not Update Display Picture");
    }
    toast.dismiss(toastId);
  };
}


export function updateProfile(token, formData) {
  return (dispatch) => {
    const toastId = toast.loading("Loading...");
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    };

    toast.promise(
      fetch("http://localhost:4000/api/v1/profile/updateProfile", requestOptions)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (!data.success) {
            throw new Error(data.message || 'Update failed');
          }
          const userImage = data.updatedUserDetails.image
            ? data.updatedUserDetails.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${data.updatedUserDetails.firstName} ${data.updatedUserDetails.lastName}`;
          dispatch(
            setUser({ ...data.updatedUserDetails, image: userImage })
          );
          toast.success("Profile Updated Successfully");
        })
        .catch(error => {
          console.error("UPDATE_PROFILE_API API ERROR............", error);
          toast.error("Could Not Update Profile");
        })
        .finally(() => {
          toast.dismiss(toastId);
        })
    );
  };
}


export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.response.data.message)
  }
  toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}