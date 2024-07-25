import UserService from "../services/userService.js";

class UserController {
  static userRegistration = async (req, res) => {
    const result = await UserService.registerUser(req.body);
    res.status(result.status).send({ status: result.status === 201 ? "success" : "failed", message: result.message });
  };

  static userLogin = async (req, res) => {
    const result = await UserService.loginUser(req.body);
    res.status(result.status).send({ status: result.status === 200 ? "success" : "failed", message: result.message });
  };
}

export default UserController;
