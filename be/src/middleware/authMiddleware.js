import pkg from 'jsonwebtoken';
const { verify } = pkg;

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Получаем токен из заголовка

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Сохраняем декодированные данные пользователя в запрос
        next(); // Продолжаем выполнение следующего middleware или маршрута
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;