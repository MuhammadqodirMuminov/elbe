import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { Review, ReviewSchema } from './models/review.schema';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

@Module({
    imports: [DatabaseModule, DatabaseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
})
export class ReviewsModule {}
