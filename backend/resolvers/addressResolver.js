import Address from "../models/Address.js";

export default {
  Query: {
    async getAddresses(_, __, { user }) {
      if (!user) throw new Error("Unauthorized");
      return Address.find({ userId: user.id }).sort({ createdAt: -1 });
    }
  },

  Mutation: {
    async addAddress(_, { input }, { user }) {
      if (!user) throw new Error("Login required");

      const address = await Address.create({
        ...input,
        userId: user.id,
      });

      return address;
    },

    async updateAddress(_, { id, input }, { user }) {
      if (!user) throw new Error("Login required");

      return Address.findOneAndUpdate(
        { _id: id, userId: user.id },
        input,
        { new: true }
      );
    },

    async deleteAddress(_, { id }, { user }) {
      if (!user) throw new Error("Login required");

      await Address.findOneAndDelete({ _id: id, userId: user.id });
      return "Address deleted successfully.";
    }
  }
};
