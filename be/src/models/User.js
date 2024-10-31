import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rewards: [{ type: String }],
    chanceFactors: {
        type: Map,
        of: Number,
        default: () => new Map()
    }
});

export default model('User', userSchema);