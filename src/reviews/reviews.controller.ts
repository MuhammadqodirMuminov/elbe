import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Post()
    @ApiOperation({ summary: 'Create a review' })
    create(@Body() createReviewDto: CreateReviewDto) {
        return this.reviewsService.create(createReviewDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all reviews' })
    findAll() {
        return this.reviewsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a review by ID' })
    findOne(@Param('id') id: string) {
        return this.reviewsService.findOne(id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a review by ID' })
    remove(@Param('id') id: string) {
        return this.reviewsService.remove(id);
    }
}
