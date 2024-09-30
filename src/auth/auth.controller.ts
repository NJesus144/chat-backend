/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from '../users/dto/register-user.dto'
import { User } from '../schemas/user.schema'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto)
  }

  @Post('login')
  async login(
    @Body() loginUseDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginUseDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<{ username: string }> {
    return this.authService.getUserProfile(req.user.id)
  }
}
