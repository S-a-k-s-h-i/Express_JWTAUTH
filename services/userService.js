import UserModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  static async registerUser(data) {
    const { name, email, password, confirm_password, tc } = data;
    if (name && email && password && confirm_password && tc) {
      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        return { status: 400, message: "User already exists with this email" };
      }
      if (password !== confirm_password) {
        return {
          status: 400,
          message: "Password & confirm password do not match",
        };
      }
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new UserModel({
          name,
          email,
          password: hashedPassword,
          tc,
        });
        await user.save();
        return { status: 201, message: "User registered successfully" };
      } catch (error) {
        return { status: 500, message: "Failed to register the user" };
      }
    } else {
      return { status: 400, message: "All fields are required" };
    }
  }

  static async loginUser(data) {
    const { email, password } = data;
    if (email && password) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return { status: 400, message: "User with the email does not exist" };
      }
      try {
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (passwordMatched) {
          const jwtToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "5d" }
          );
          return { status: 200, message: "Login successful", token: jwtToken };
        } else {
          return { status: 400, message: "Password does not match" };
        }
      } catch (error) {
        return { status: 500, message: "Failed to login" };
      }
    } else {
      return { status: 400, message: "All fields are required" };
    }
  }

  static async changePassword(userId,data) {
    const { password, confirm_password } = data;
    if (password && confirm_password) {
      if (password !== confirm_password) {
        return {
          status: 400,
          message: "Password do not match with confirm password",
        };
      }
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await UserModel.updateOne(
          { _id:userId },
          {
            password: hashedPassword,
          }
        );
        return { status: 200, message: "Password updated successfully" };
      } catch (error) {
        return { status: 500, message: "Failed to change the password" };
      }
    } else {
      return { status: 400, message: "All fields are required" };
    }
  }
}

export default UserService;
