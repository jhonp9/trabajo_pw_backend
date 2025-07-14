"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviews_controller_1 = require("../controllers/reviews.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.get('/:gameId', reviews_controller_1.getGameReviews);
router.post('/:gameId', auth_middleware_1.authenticate, reviews_controller_1.createGameReview);
exports.default = router;
