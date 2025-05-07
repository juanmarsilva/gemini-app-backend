import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { GeminiModule } from './gemini/gemini.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),

    GeminiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
