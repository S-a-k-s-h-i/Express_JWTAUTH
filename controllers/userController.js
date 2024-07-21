import UserModel from "../models/users.js";
import bcrypt from "bcrypt";

class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, password, confirm_password, tc } = req.body;
    if (name && email && password && confirm_password && tc) {
      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        res
          .status(400)
          .send({
            status: "failed",
            message: "User Already exist with this email",
          });
      }
      if (password !== confirm_password) {
        res
          .status(400)
          .send({
            status: "failed",
            message: "Password & confirm password do not match",
          });
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
        res
          .status(201)
          .send({ status: "success", message: "User registered successfully" });
      } catch (error) {
        res
          .status(500)
          .send({ status: "failed", message: "Failed to register the user" });
      }
    } else {
      res
        .status(400)
        .send({ status: "failed", message: "All fields are required" });
    }
  };

  static userLogin = async(req,res) => {
    const {email,password} = req.body;
    if(email && password){
        const user = await UserModel.findOne({email});
        if(!user){
            res.status(400).send({status:"failed",message:"User with the email do not exist"});
        }
        try{
            const passwordMatched = await bcrypt.compare(password,user.password);
            if(user && passwordMatched){
                res.status(200).send({status:"success"});
            }else{
                res.status(400).send({status:"failed",message:"password do not match"});
            }
        }catch(error){
            res
            .status(500)
            .send({ status: "failed", message: "Failed to Login" });
        }
    }else{
        res
        .status(400)
        .send({ status: "failed", message: "All fields are required" });
    }
  }
}

export default UserController;
