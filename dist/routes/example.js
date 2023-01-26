"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// getting all
router.get("/", (req, res) => {
    res.status(200).json({ message: "Get Deals" });
});
// getting one
router.get("/:id", (req, res) => {
    res.status(200).json({ message: `Get Deal ${req.params.id}` });
});
// creating one
router.post("/", (req, res) => {
    res.status(201).json({ message: "Create Deal" });
});
// updating one
router.put("/:id", (req, res) => {
    res.status(204).json({ message: `Update Deal ${req.params.id}` });
});
// deleting one
router.delete("/:id", (req, res) => {
    res.status(204).json({ message: `Delete Deal ${req.params.id}` });
});
exports.default = router;
//# sourceMappingURL=example.js.map