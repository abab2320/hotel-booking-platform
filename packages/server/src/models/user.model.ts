import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
    role: 'merchant' | 'admin';
    emailVerified: boolean;
    verificationToken?: string | null;
    verificationExpires?: Date | null;
    lastVerificationSentAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified' | 'verificationToken' | 'verificationExpires' | 'lastVerificationSentAt'> { }

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: number;
    declare username: string;
    declare email: string;
    declare password: string;
    declare role: 'merchant' | 'admin';
    declare emailVerified: boolean;
    declare verificationToken?: string | null;
    declare verificationExpires?: Date | null;
    declare lastVerificationSentAt?: Date | null;
    declare createdAt: Date;
    declare updatedAt: Date;

    async comparePassword(inputPassword: string): Promise<boolean> {
        return bcrypt.compare(inputPassword, this.password);
    }

    async generateVerificationToken(expireHours = 24): Promise<string> {
        const token = crypto.randomBytes(32).toString('hex');
        this.verificationToken = token;
        this.verificationExpires = new Date(Date.now() + expireHours * 3600 * 1000);
        this.lastVerificationSentAt = new Date();
        await this.save();
        return token;
    }

    async clearVerification() {
        this.verificationToken = null;
        this.verificationExpires = null;
        await this.save();
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '用户ID'
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        validate: { len: [3, 50] },
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(val: string) { this.setDataValue('email', val.trim().toLowerCase()); }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('merchant', 'admin'),
        defaultValue: 'merchant',
        allowNull: false,
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    verificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    verificationExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastVerificationSentAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
        beforeCreate: async (user: any) => {
            if (user.password) user.password = await bcrypt.hash(user.password, 10);
            if (user.email) user.email = user.email.trim().toLowerCase();
        },
        beforeUpdate: async (user: any) => {
            if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
            if (user.changed('email')) user.email = user.email.trim().toLowerCase();
        }
    }
});

export default User;
