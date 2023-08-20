import mongoose from 'mongoose';


export const modelName = 'secure-note';

export const schema = new mongoose.Schema({
    content: String,
    tag: String,
    key: String,
    iv: String
});