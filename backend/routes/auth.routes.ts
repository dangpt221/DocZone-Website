
import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/refresh-token', (req, res) => { /* Logic refresh token */ });
router.post('/logout', (req, res) => { /* Logic logout */ });

export default router;
