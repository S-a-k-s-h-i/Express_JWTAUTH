import Queue from "bull";
import redis from "../configs/redisConfig.js";
const emailQueue = new Queue("emailQueue",{redis});
import transporter from "../configs/emailConfig.js";

emailQueue.process(async (job) => {
  const { email, link } = job.data;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "DEV - Password Reset Email",
      html: `<p><a href=${link}>Click here </a>to reset password</p>`,
    });
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.log("Failed to send password reset email", error);
  }
});

export default emailQueue;
