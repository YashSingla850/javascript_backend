import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCLoudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body
    if ([fullname, email, username, password].some((field) =>
        field?.trim() === ""
    )) {
        throw new ApiError(400, "All field is required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "User Existed");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required")
    }
    const avatar = await uploadOnCLoudinary(avatarLocalPath)
    const coverImage = await uploadOnCLoudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Avatar image is required")
    }
    console.log(avatar.url);
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    console.log(createdUser);
    if (!createdUser) {
        throw new ApiError(500, "something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user created successfully")
    )

})

export { registerUser };