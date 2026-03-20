import express from "express";
import { 
  createReview, 
  getReviewsByUserId, 
  getReviewById, 
  updateReview, 
  deleteReview,
  getReviewStats
} from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await getReviewsByUserId(req.user.userId);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const stats = await getReviewStats(req.user.userId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const review = await getReviewById(req.params.id, req.user.userId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: "Failed to fetch review" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { album, artist, genre, rating, mood, reflection, coverArt } = req.body;
    
    if (!album || !artist || !genre || !rating) {
      return res.status(400).json({ error: "Album, artist, genre, and rating are required" });
    }
    
    const review = await createReview({
      album,
      artist,
      genre,
      rating: parseInt(rating),
      mood: mood || "",
      reflection: reflection || "",
      coverArt: coverArt || `https://placehold.co/400x400/1f2329/9aa0a6?text=${encodeURIComponent(album)}`,
      userId: req.user.userId
    });
    
    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const success = await updateReview(
      req.params.id,
      req.user.userId,
      req.body
    );
    
    if (!success) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    const updatedReview = await getReviewById(req.params.id, req.user.userId);
    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await deleteReview(req.params.id, req.user.userId);
    
    if (!success) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;