import { Router } from 'express';
import User from '../models/User.js';

const router = Router();
// Получение всех игроков
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('username rewards');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Обновление списка наград игрока
router.post('/:userId/rewards', async (req, res) => {
    const { userId } = req.params;
    const { reward } = req.body;

    if (!reward) return res.status(400).json({ message: 'Награда не указана' });

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        user.rewards.push(reward);
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
