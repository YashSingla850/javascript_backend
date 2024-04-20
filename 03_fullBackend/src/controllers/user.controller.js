import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCLoudinary } from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "something went wrong while generating refresh or access token")
    }
}


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

const loginUser = asyncHandler(async (req, res) => {
    /*
    1 username an password 
    then check for username and password , 
    if (incorrect )throw err
    else return -:
    2 send a access token and refresh token to user
    3
    */

    const { username, email, password } = req.body;
    console.log(req.body)
    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)
    console.log(accessToken);
    console.log(refreshToken);

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
    console.log(loggedInUser)
    // creating cookie
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser, accessToken, refreshToken

            },
                "User LoggedIn SuccessFully"
            )
        )

})

const loggedOutUser = asyncHandler((async (req, res) => {

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined

        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User LoggedOut"))
}))
export { registerUser, loginUser, loggedOutUser };