import express, { Request, Response } from "express";
const router = express.Router();

// getting all
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Get Deals" });
});

// getting one
router.get("/:id", (req: Request, res: Response) => {
  res.status(200).json({ message: `Get Deal ${req.params.id}` });
});

// creating one
router.post("/", (req: Request, res: Response) => {
  res.status(201).json({ message: "Create Deal" });
});

// updating one
router.put("/:id", (req: Request, res: Response) => {
  res.status(204).json({ message: `Update Deal ${req.params.id}` });
});

// deleting one
router.delete("/:id", (req: Request, res: Response) => {
  res.status(204).json({ message: `Delete Deal ${req.params.id}` });
});

export default router;
