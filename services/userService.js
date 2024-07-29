import UserModel from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from '../configs/emailConfig.js';
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

  static async changePassword(userId, data) {
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
          { _id: userId },
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

  static async userProfile(userId) {
    try {
      const user = await UserModel.findById(userId).select("-password");
      return {
        status: 200,
        message: "User details fetched successfully",
        data: user,
      };
    } catch (error) {
      return {
        status: 500,
        message: "Failed to get the user profile",
      };
    }
  }

  static async sendUserPasswordResetEmail(email) {
    if (email) {
      try {
        const user = await UserModel.findOne({ email });
        if (user) {
          const secret = user._id + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ userID: user._id }, secret, {
            expiresIn: "15m",
          });
          // /api/user/reset/:id/:token
          const link = `http://127.0.0.1:3000/api/user/reset-password/${user._id}/${token}`;
          //send email
          const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to:user.email,
            subject:'DEV - Password Reset Email',
            html:`<p><a href=${link}>Click here </a>to reset password</p>`
          })
          return { status: 200, message: "Password reset email sent successfully" };
        } else {
          return { status: 400, message: "Email does't exist" };
        }
      } catch (error) {
        console.log(error);
        return {
          status: 500,
          message: "Failed to generate reset email",
        };
      }
    } else {
      return { status: 400, message: "Email is required" };
    }
  }

  static async userPasswordReset(data,params){
    const { password,confirm_password} = data;
    const {id,token} = params;
    const user = await UserModel.findById(id);
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try{
      jwt.verify(token,new_secret);
      if(password && confirm_password){
        if(password == confirm_password){
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id,{
            $set: {
              password: hashedPassword
            }
          })
          return { status: 200, message: "Password reset successfully" };
        }else{
          return { status: 400, message: "Password does not match" };
        }
      }else{
        return { status: 400, message: "All fields are required" };
      }
    }catch(error){
      return {
        status: 500,
        message: "Failed to update the password, link not valid anymore",
      };
    }
  }
}

export default UserService;
