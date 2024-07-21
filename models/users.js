import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type:String, required:true,trim:true},
  email: { type:String, required:true,trim:true,unique:true},
  password: { type:String, required:true,trim:true},
  tc: { type:Boolean, required:true},
})

const UserModel = mongoose.model("user",UserSchema);

export default UserModel;