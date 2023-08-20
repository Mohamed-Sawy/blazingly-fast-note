import mongoose from "mongoose";


export const modelName = 'note';

export const schema = new mongoose.Schema({
    content: String,
    tag: String
});