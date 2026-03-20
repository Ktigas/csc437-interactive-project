import { getCollection } from "../db.js";
import { ObjectId } from "mongodb";

export async function createReview(reviewData) {
  const reviews = await getCollection(process.env.REVIEWS_COLLECTION_NAME);
  
  const review = {
    ...reviewData,
    userId: new ObjectId(reviewData.userId),
    rating: parseInt(reviewData.rating),
    date: new Date(),
    createdAt: new Date()
  };
  
  const result = await reviews.insertOne(review);
  return { ...review, _id: result.insertedId };
}

export async function getReviewsByUserId(userId) {
  const reviews = await getCollection(process.env.REVIEWS_COLLECTION_NAME);
  return await reviews
    .find({ userId: new ObjectId(userId) })
    .sort({ date: -1 })
    .toArray();
}

export async function getReviewById(id, userId) {
  const reviews = await getCollection(process.env.REVIEWS_COLLECTION_NAME);
  return await reviews.findOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId)
  });
}

export async function updateReview(id, userId, updateData) {
  const reviews = await getCollection(process.env.REVIEWS_COLLECTION_NAME);
  
  delete updateData._id;
  delete updateData.userId;
  
  const result = await reviews.updateOne(
    { _id: new ObjectId(id), userId: new ObjectId(userId) },
    { $set: { ...updateData, date: new Date() } }
  );
  
  return result.modifiedCount > 0;
}

export async function deleteReview(id, userId) {
  const reviews = await getCollection(process.env.REVIEWS_COLLECTION_NAME);
  const result = await reviews.deleteOne({
    _id: new ObjectId(id),
    userId: new ObjectId(userId)
  });
  
  return result.deletedCount > 0;
}

export async function getReviewStats(userId) {
  const reviews = await getReviewsByUserId(userId);
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      favoriteGenre: null,
      genreCounts: {},
      reviewsThisMonth: 0
    };
  }
  
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  
  const genreCounts = reviews.reduce((acc, review) => {
    acc[review.genre] = (acc[review.genre] || 0) + 1;
    return acc;
  }, {});
  
  const favoriteGenre = Object.keys(genreCounts).length > 0 
    ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
    : null;
  
  const currentMonth = new Date().getMonth();
  const reviewsThisMonth = reviews.filter(r => new Date(r.date).getMonth() === currentMonth).length;
  
  return {
    totalReviews,
    averageRating,
    favoriteGenre,
    genreCounts,
    reviewsThisMonth
  };
}