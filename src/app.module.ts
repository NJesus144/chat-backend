import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './users/users.module'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
