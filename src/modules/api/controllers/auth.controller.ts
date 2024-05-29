import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@/api/services/auth.service';
import { WalletService } from '@/blockchain/services';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(WalletService)
  private readonly walletService: WalletService;

  @Get('/oauth')
  @ApiOperation({ summary: 'Send get oauth request to login' })
  async getOauthUrl() {
    const response = await this.authService.getOauthUrl();
    return {
      statusCode: HttpStatus.OK,
      data: response,
    };
  }
}
