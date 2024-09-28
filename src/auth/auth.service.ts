import { Injectable } from '@nestjs/common'
// import { User, UsersService } from '../users/users.service'
import { RegisterUserDto } from '../users/dto/register.user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../schemas/user.schema'
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // async validateUser(username: string, pass: string): Promise<any> {
  //   const user = await this.usersService.findOne(username)
  //   if (user && user.password === pass) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password, ...result } = user
  //     return result
  //   }
  //   return null
  // }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { username, password } = registerUserDto

    const exixtingUser = await this.userModel.findOne({ username }).exec()
    if (exixtingUser) {
      throw new Error('User already exists')
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const newUser = new this.userModel({ username, password: hashedPassword })
    return newUser.save()
  }
}
