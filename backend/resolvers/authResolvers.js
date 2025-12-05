import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { signUserAccess } from "../utils/jwt.js";

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
      if (!user) throw new Error("User not found");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Wrong password");

      return {
        id: user._id,
        name: user.name,
        number: user.number,
        token: signUserAccess({ id: user._id })
      };
    }
  }
};

export default authResolver;
