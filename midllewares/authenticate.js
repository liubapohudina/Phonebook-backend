import HttpError from "../helpers/HttpError.js";
import jwt from 'jsonwebtoken';
import { configDotenv } from "dotenv";
import { findUser } from "../services/authServices.js";
configDotenv();

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(HttpError(401, "Authorization header not found"));
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401, "Authorization bearer not found"))
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await findUser({ _id: id });
        if (!user) {
            return next(HttpError(401, "User not found"));
        }
        if (!user.token) {
            return next(HttpError(401, "Token not found"))
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, "Not authorized"))
    }

}
export default authenticate;