import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendMail.js";
import { findUser, registerUser, updateUser } from "../services/authServices.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";


const avatarPath = path.resolve("public", "avatars");

configDotenv()
const PROJECT_URL = 'https://phonebook-frontend-beta.vercel.app//api';
const { JWT_SECRET } = process.env;

export const fetchRegisterUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await findUser({ email });
        if (existingUser) {
            throw HttpError(409, "Email is already in use");
        }
        // const { path: oldPath, filename } = req.file;
        // const newPath = path.join(avatarPath, filename);
        // await fs.rename(oldPath, newPath);
        const avatarURL = gravatar.url(email);
        const hashPassword = await bcrypt.hash(password, 10);
        const verificationToken = nanoid();
        const newUser = await registerUser({ ...req.body, avatarURL: avatarURL, password: hashPassword, verificationToken });
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${PROJECT_URL}/verify/${verificationToken}">Click verify email</a>`
        }
       await sendEmail(verifyEmail);
        const responseBody = {
            user: {
                name: newUser.name,
                email: newUser.email,
                avatarURL: avatarURL,
                subscription: newUser.subscription,
            }
        };
        res.status(201).json(responseBody);
    } catch (error) {
       next(error)
    }
};

export const fetchUserVerify = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await findUser({ verificationToken });
        if (!user || user.verify) {
            throw HttpError(404, "Not found or verification has already been passed")
        }
        await updateUser({ _id: user._id }, { verify: true, verificationToken: null })
        res.status(200).json({
            message: 'Verification successful'
        })
    } catch (error) {
        next(error)
    }
}

export const fetchResendVerify = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await findUser({ email });
        if (!user) {
            throw HttpError(400, "User with email not found or email is wrong")
        }
        if (user.verify) {
            throw HttpError(400, "Verification has already been passed")
        }
        const verifyEmail = {
            to: email,
            subject: "Verify email",
            html: `<a target="_blank" href="${PROJECT_URL}/verify/${user.verificationToken}">Click verify email</a>`
        }
        await sendEmail(verifyEmail);
    
        res.status(200).json({
            message: "Verification email sent"
        })
    } catch (error) {
        next(error)
    }
}


export const fetchLoginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findUser({ email })
        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }
        if (!user.verify) {
            throw HttpError(401, "Email not verify" )
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }
        const { _id: id } = user;
        const payload = {
            id
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
        await updateUser({ _id: id }, { token });
        
        const responseBody = {
            token: token,
            user: {
                email: user.email,
                subscription: user.subscription
            }
        };
        
        res.status(200).json(responseBody);
    } catch (error) {
        next(error)
    }
}

export const fetchCurrentUser = async (req, res) => {
       const { email, subscription } = req.user;
       res.status(200).json({email, subscription})
}

export const fetchLogoutUser = async (req, res) => {
    const { _id } = req.user;
    await updateUser({ _id }, { token: "" });
    res.status(204).json({message: "No Content"});
}
export const fetchUpdateSubUser = async (req, res) => {
    const { _id, email } = req.user;
    const { subscription } = req.body;
    await updateUser({ _id }, { subscription: subscription });
    res.status(201).json({message: `User ${email} subscription changed to ${subscription}`})
}

export const fetchUpdateUserAvatar = async (req, res) => {
    if (!req.file) {
       return res.status(400).json({ error: "File not found" })
    }
    const { _id} = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    const avatarURL = path.join("avatars", filename);
    Jimp.read(oldPath)
     .then((lenna) => {
     return lenna
      .resize(250, 250) 
      .quality(60) 
      .write(newPath);
  })
  .catch((err) => {
    throw err(err);
  });
    await fs.rename(oldPath, newPath);
    await updateUser({ _id }, { avatarURL: avatarURL });
    res.status(200).json({avatarURL : avatarURL})
}