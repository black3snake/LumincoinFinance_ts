import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";
import {OpenNewRouteHandlerType} from "../../types/open-new-route-handler.type";
import {Router} from "../../router";

export class Logout {
    readonly openNewRoute: OpenNewRouteHandlerType;
    constructor(openNewRoute: OpenNewRouteHandlerType) {
        this.openNewRoute = openNewRoute;

        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/login');
            return;
        }
        this.logout().then();
    }

    private async logout(): Promise<void> {
        // request
        await AuthService.logout({
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey) as string
        })
        AuthUtils.removeAuthInfo();
        await this.openNewRoute('/login');
    }
}