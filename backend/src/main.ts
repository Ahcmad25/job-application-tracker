import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);

  console.log(`Backend running at http://localhost:${port}`);
}

void bootstrap();