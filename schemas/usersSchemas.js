import Joi from 'joi';
import { emailRegepxp, namePattern } from '../constants/constUser.js';

export const usersSignUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegepxp).required(),
    password: Joi.string().min(6).required(),
    avatarURL: Joi.string(),
})

export const userSignInSchema = Joi.object({
    email: Joi.string().pattern(emailRegepxp).required(),
    password: Joi.string().min(6).required(),
})

export const userUpdateSub = Joi.object({
    email: Joi.string().pattern(emailRegepxp),
    subscription: Joi.string().valid('starter', 'pro', 'business')
});

export const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegepxp).required(),
})
