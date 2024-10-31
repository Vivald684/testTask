import { connect, mongoose } from 'mongoose';
import  Lootbox  from './models/Lootbox.js';
const lootboxes = [
    {
        rewards: [
            { item: 'Gold', baseChance: 50, playerChanceFactor: 1 },
            { item: 'Silver', baseChance: 30, playerChanceFactor: 1 },
            { item: 'Bronze', baseChance: 20, playerChanceFactor: 1 }
        ]
    },
    {
        rewards: [
            { item: 'Diamond', baseChance: 10, playerChanceFactor: 1 },
            { item: 'Emerald', baseChance: 20, playerChanceFactor: 1 },
            { item: 'Ruby', baseChance: 30, playerChanceFactor: 1 }
        ]
    }
];

async function seedDatabase() {
    await connect('mongodb+srv://levvadik02:JUYZ6TW3PzoM4htV@cluster0.0vtt2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    await Lootbox.deleteMany({});

    await Lootbox.insertMany(lootboxes);

    console.log('База данных успешно заполнена!');
    mongoose.connection.close();
}

seedDatabase().catch(console.error);