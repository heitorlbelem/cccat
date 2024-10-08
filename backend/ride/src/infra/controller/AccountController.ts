import GetAccount from "../../application/usecase/GetAccount";
import Signup from "../../application/usecase/Signup";
import { inject } from "../di/DI";
import { HttpServer } from "../http-server/HttpServer";

export class AccountController {
  @inject("httpServer")
  httpServer?: HttpServer
  @inject("signup")
  signup?: Signup
  @inject("getAccount")
  getAccount?: GetAccount

  constructor() {
    this.httpServer?.register("post", "/signup", async (_: any, body: any) => {
      const output = await this.signup?.execute(body);
      return output
    });
    
    this.httpServer?.register("get", "/accounts/:accountId", async (params: any, _: any) => {
      const output = await this.getAccount?.execute(params.accountId);
      return output
    });
  }
}