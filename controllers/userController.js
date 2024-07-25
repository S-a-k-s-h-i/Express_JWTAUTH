import UserService from "../services/userService.js";

class UserController {
  static userRegistration = async (req, res) => {
    const result = await UserService.registerUser(req.body);
    res
      .status(result.status)
      .send({
        status: result.status === 201 ? "success" : "failed",
        message: result.message,
      });
  };

  static userLogin = async (req, res) => {
    const result = await UserService.loginUser(req.body);
    if (result.status == 200) {
      res
        .status(result.status)
        .send({
          status: "success",
          message: result.message,
          token: result.token,
        });
    } else {
      res
        .status(result.status)
        .send({ status: "failed", message: result.message });
    }
  };

  static userChangePassword = async (req, res) => {
    const userId = req.user._id;
    const result = await UserService.changePassword(userId,req.body);
    res
      .status(result.status)
      .send({
        status: result.status === 200 ? "success" : "failed",
        message: result.message,
      });
  };
}

export default UserController;
