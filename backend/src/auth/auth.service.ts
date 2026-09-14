import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: string; // 'admin' | 'property_owner' | 'regular_user'
  adminCode?: string; // secret code required for admin registration
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private supabase: any;

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL') || '',
      this.configService.get<string>('SUPABASE_SERVICE_KEY') || '',
    );
  }

  async register(registerDto: RegisterDto) {
    const { email, password, name, role, adminCode } = registerDto;
    let userRole: string;
    // Admin can only be created if a valid secret code is provided
    if (role === 'admin') {
      const secret = this.configService.get<string>('ADMIN_SIGNUP_CODE');
      if (!secret || adminCode !== secret) {
        throw new BadRequestException('Invalid admin signup code');
      }
      userRole = 'admin';
    } else if (role === 'property_owner') {
      userRole = 'property_owner';
    } else {
      userRole = 'regular_user';
    }


    // Check if user already exists
    const { data: existingUser, error: checkError } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .is('deleted_at', null)
      .single();

    if (checkError?.code !== 'PGRST116' && existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await this.supabase
      .from('users')
      .insert([
        {
          email,
          name,
          password_hash: hashedPassword,
          role: userRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
  console.error('Supabase registration error:', error);
  throw new BadRequestException(error.message || 'Failed to register user');
}

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .is('deleted_at', null)
      .single();

    if (error || !user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string) {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .is('deleted_at', null)
      .single();

    if (error || !user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
