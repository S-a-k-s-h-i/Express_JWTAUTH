import jwt from "jsonwebtoken";
import UserModel from "../models/users.js";

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      const token = authorization.split(" ")[1];
      //Verify token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await UserModel.findById(userId).select("-password");
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
  } else {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No token" });
  }
};

export default authenticateUser;
