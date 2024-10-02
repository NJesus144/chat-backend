import { RegisterUserDto } from './dto/register-user.dto'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, password } = registerUserDto

    const existingUser = await this.userModel.findOne({ username }).exec()
    if (existingUser) {
      throw new ConflictException('User already exists')
    }

    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new this.userModel({ username, password: hashPassword })
    return newUser.save()
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).exec()
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).exec()
    if (!user) throw new NotFoundException('User not found')

    return user
  }
}
