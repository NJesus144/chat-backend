import { Injectable } from '@nestjs/common'
// import { User, UsersService } from '../users/users.service'
import { RegisterUserDto } from '../users/dto/register-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from '../users/dto/login-user.dto'
import { JwtService } from '@nestjs/jwt'
import { UserProfileDto } from '../users/dto/user-profile.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, password } = registerUserDto

    const exixtingUser = await this.userModel.findOne({ username }).exec()
    if (exixtingUser) {
      throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new this.userModel({ username, password: hashedPassword })
    return newUser.save()
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec()
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    return user
  }

  async login(lodingUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { username, password } = lodingUserDto
    const user = await this.validateUser(username, password)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const payload = { username: user.username, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    console.log('userId usuario', userId)
    const user = await this.userModel.findById(userId).exec()

    console.log('usuario encontrado ===>', user)
    if (!user) {
      throw new Error('User not found')
    }
    return { username: user.username }
  }
}
