import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    var role = this.reflector.get<string>("role", context.getHandler());

    // If there is no role, then it is public
    if (!role) return true;

    var request = context.switchToHttp().getRequest();
    var user = request.user;

    // If there is no user or no roles, then it is not authorized
    if (!user || !Array.isArray(user.roles)) return false;

    // If the user has the role, then it is authorized
    return user.roles.includes(role);
  }
}
