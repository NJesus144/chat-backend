import { Injectable, UnauthorizedException } from '@nestjs/common'
import { RegisterUserDto } from '../users/dto/register-user.dto'
import { User } from '../schemas/user.schema'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { UserProfileDto } from '../users/dto/user-profile.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    return this.userService.createUser(registerUserDto)
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username)
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    return user
  }

  async login(lodingUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { username, password } = lodingUserDto
    const user = await this.validateUser(username, password)
    if (!user) throw new UnauthorizedException('Invalid credentials')

    const payload = { username: user.username, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    return this.userService.getUserProfile(userId)
  }
}
