import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({
  toJSON: {
    virtuals: false,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret.id
      return ret
    },
  },
})
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ required: true, unique: true })
  username: string

  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
