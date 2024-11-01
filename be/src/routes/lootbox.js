import { Router } from 'express';
const router = Router();

import Lootbox from '../models/Lootbox.js';
import User from '../models/User.js';

import { mongoose } from 'mongoose';

router.post('/open', async (req, res) => {
    const { boxId, playerId } = req.body;

    console.log(boxId, playerId );
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(playerId).session(session);
        const lootbox = await Lootbox.findById(boxId).session(session);

        console.log(user, lootbox );
        if (lootbox.isOpened) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Лутбокс уже открыт!" });
        }

        console.log('adjustedRewards');
        console.log('user.chanceFactors:', user.chanceFactors);
        console.log('lootbox.rewards:', lootbox.rewards);
        const adjustedRewards = lootbox.rewards.map(reward => {
            const chanceFactor = user.chanceFactors[boxId] || 1;
            return {
                item: reward.item,
                chance: reward.baseChance * chanceFactor
            };
        });
        
        console.log('adjustedRewards', adjustedRewards);


        const reward = getRandomReward(adjustedRewards);

        lootbox.isOpened = true; // Обновляем статус
        lootbox.openCount += 1; // Увеличиваем счетчик открытий
        lootbox.version += 1; // Увеличиваем версию
        await lootbox.save({ session });

        await session.commitTransaction();
        return res.json({ success: true, reward });
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ success: false, message: "Ошибка при открытии лутбокса" });
    } finally {
        session.endSession();
    }
});

router.get('/lootbox-statistics', async (req, res) => {
    try {
        const lootboxes = await Lootbox.find();
        const statistics = lootboxes.map(box => ({
            id: box._id,
            openCount: box.openCount,
            rewards: box.rewards.map(reward => ({
                item: reward.item,
                baseChance: reward.baseChance,
                playerChanceFactor: reward.playerChanceFactor
            }))
        }));
        return res.json(statistics);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка получения статистики" });
    }
});

router.get('/lootboxes', async (req, res) => {
    try {
        const lootboxes = await Lootbox.find(); // Получаем все лутбоксы
        return res.json(lootboxes);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка получения лутбоксов" });
    }
});


function getRandomReward(rewards) {
    const totalChance = rewards.reduce((sum, reward) => sum + reward.baseChance, 0);
    const randomNum = Math.random() * totalChance;
    
    let cumulativeChance = 0;
    for (const reward of rewards) {
        cumulativeChance += reward.baseChance;
        if (randomNum < cumulativeChance) {
            return reward.item;
        }
    }
    return null;
}

export default router;
