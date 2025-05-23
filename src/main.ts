import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exeption-filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { rawBody: true });
    app.useGlobalFilters(new HttpExceptionFilter());
    app.enableCors({ origin: '*' });
    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigService);
    const port = configService.get<string>('PORT');

    const config = new DocumentBuilder().setTitle('ELBE-commerce').setDescription('this is bacend for elbecommerce webste').setVersion('1.0').addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Bearer' }).build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port);
}
bootstrap();
//test
