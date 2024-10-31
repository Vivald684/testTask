import { Schema, model } from 'mongoose';

const lootboxSchema = new Schema({
    rewards: [
        {
            item: String,
            baseChance: Number,
            playerChanceFactor: Number
        }
    ],
    isOpened: { type: Boolean, default: false },
    version: { type: Number, default: 0 },
    openCount: { type: Number, default: 0 } // Количество открытий
});

const Lootbox = model('Lootbox', lootboxSchema);
export default Lootbox;
