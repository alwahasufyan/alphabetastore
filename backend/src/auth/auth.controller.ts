import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './types/jwt-payload.type';

type AuthenticatedRequest = {
	user: JwtPayload;
};

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Throttle({ default: { ttl: 60_000, limit: 10 } })
	@Post('register')
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Public()
	@Throttle({ default: { ttl: 60_000, limit: 10 } })
	@Post('login')
	login(@Body() loginDto: LoginDto) {
		return this.authService.login(loginDto);
	}

	@Public()
	@Throttle({ default: { ttl: 60_000, limit: 20 } })
	@Post('refresh')
	refresh(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.refresh(refreshTokenDto);
	}

	@Public()
	@Post('logout')
	logout(@Body() refreshTokenDto: RefreshTokenDto) {
		return this.authService.logout(refreshTokenDto);
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	me(@Req() request: AuthenticatedRequest) {
		return this.authService.me(request.user.sub);
	}
}