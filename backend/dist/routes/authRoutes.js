"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authcontroller_1 = require("../controllers/authcontroller");
const router = (0, express_1.Router)();
router.post('/signup', authcontroller_1.registerUser);
router.post('/login', authcontroller_1.loginUser);
exports.default = router;
