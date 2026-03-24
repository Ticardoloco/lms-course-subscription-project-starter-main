import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document{
    clerkId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
    clerkId: {
        type: String, 
        required: true,
        unique: true,
        index: true,
    }, 

    email: {
        type: String, 
        required: true,
        unique: true,
        index: true,
    }, 

    firstName: {
        type: String, 
    }, 

    lastName: {
        type: String, 
    }, 

    phoneNumber: {
        type: Number, 
    }, 

    imageUrl: {
        type: String, 
    }, 
}, {
    timestamps: true,
})

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema)

export default User;