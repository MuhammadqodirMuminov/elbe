import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './models/review.schema';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

    async create(createReviewDto: CreateReviewDto): Promise<Review> {
        const createdReview = new this.reviewModel(createReviewDto);
        return createdReview.save();
    }

    async findAll(): Promise<Review[]> {
        return this.reviewModel.find().populate('user').populate('product').exec();
    }

    async findOne(id: string): Promise<Review> {
        const review = await this.reviewModel.findById(id).populate('user').populate('product').exec();
        if (!review) {
            throw new NotFoundException('Review not found');
        }
        return review;
    }

    async remove(id: string): Promise<Review> {
        const review = await this.reviewModel.findByIdAndDelete(id).exec();
        if (!review) {
            throw new NotFoundException('Review not found');
        }
        return review;
    }
}
