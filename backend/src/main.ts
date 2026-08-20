import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  if (process.env.VERCEL) {
    await app.init();
    return app.getHttpAdapter().getInstance();
  } else {
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Backend Application is running on: http://localhost:${port}/api`);
  }
}

// Run normally for local development
if (!process.env.VERCEL) {
  bootstrap();
}

// Export serverless handler for Vercel deployment
export default async (req: any, res: any) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
};
