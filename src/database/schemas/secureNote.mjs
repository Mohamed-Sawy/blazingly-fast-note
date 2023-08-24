import mongoose from 'mongoose';


export const modelName = 'secureNote';

export const schema = new mongoose.Schema({
    content: String,
    tag: String,
    key: String,
    iv: String
});