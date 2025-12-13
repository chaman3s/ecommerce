import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { signUserAccess } from "../utils/jwt.js";
import jwt from "jsonwebtoken";


const authResolver = {
  Mutation: {
    
    // SIGNUP
    signup: async (_, { name, number, password }) => {
      const exists = await User.findOne({ number });
      if (exists) throw new Error("Phone number already registered");

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({ name, number, password: hashed });

      return {
        id: user._id,
        name: user.name,
        number: user.number,
        token: signUserAccess({ id: user._id })
      };
    },

    // LOGIN
    login: async (_, { number, password }) => {
      const user = await User.findOne({ number });
      if (!user) throw new Error("Wrong number and password");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Wrong number and password");

      return {
        id: user._id,
        name: user.name,
        number: user.number,
        token: signUserAccess({ id: user._id })
      };
    },
 
    checkToken:async (_, { token }) =>{
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

        const user = await User.findById(decoded.id)
          .select("_id name number")
          .lean();

        return {
          valid: true,
          expired: false,
          userId: user?._id,
          name: user?.name,
          number: user?.number,
        };
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          return { valid: false, expired: true };
        }
        return { valid: false, expired: true };
      }
    }
  }
};
 
export default authResolver;
