import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private jwtService: JwtService){}
  async canActivate(context: ExecutionContext,): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token){
      throw new UnauthorizedException();
    }
    return Promise.resolve(true);
  }
}
