import { Module } from '@nestjs/common';
import { UsersModule } from 'src/auth/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsModule } from 'src/products/products.module';
import { WishlistDocument, WishlistSchema } from './models/wishlist.schema';
import { WishlistsController } from './wishlists.controller';
import { WishlistsService } from './wishlists.service';

@Module({
    imports: [ProductsModule, UsersModule, DatabaseModule.forFeature([{ name: WishlistDocument.name, schema: WishlistSchema }])],
    controllers: [WishlistsController],
    providers: [WishlistsService],
    exports: [WishlistsService],
})
export class WishlistsModule {}
