/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterUserDto } from '../users/dto/register-user.dto'
import { User } from '../schemas/user.schema'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User registration data',
    type: RegisterUserDto,
    examples: {
      validUser: {
        summary: 'Valid User',
        value: {
          username: 'johndoe',
          password: 'StrongPass123!'
        }
      },
      invalidUser: {
        summary: 'Invalid User',
        value: {
          username: 'jo',
          password: 'weak'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'User has been successfully created.'})
  @ApiResponse({ status: 400, description: 'Bad request.'})
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'Login in a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.'})
  @ApiResponse({ status: 400, description: 'Unauthorized.'})
  async login(@Body() loginUseDto: LoginUserDto): Promise<{ access_token: string }> {
    return this.authService.login(loginUseDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async getProfile(@Request() req): Promise<{ username: string }> {
    return this.authService.getUserProfile(req.user.userId)
  }
}
