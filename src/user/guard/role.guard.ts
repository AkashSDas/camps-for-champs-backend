import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    var role = this.reflector.get<string[]>("role", context.getHandler());
    if (!role) return true;
    var request = context.switchToHttp().getRequest();
    var user = request.user;
    if (!user || !Array.isArray(user.roles)) return false;
    return user.roles.includes(role);
  }
}
