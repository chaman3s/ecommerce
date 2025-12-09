import mongoose from "mongoose";

const CarouselSchema = new mongoose.Schema({
 image:{type: String,required: true, },
 title:{type: String,},
 description:{type: String}
}, { timestamps: true });

export default mongoose.model("Carousel", CarouselSchema);
