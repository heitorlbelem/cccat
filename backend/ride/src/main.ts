
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { Registry } from "./infra/di/DI";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressServer } from "./infra/http-server/HttpServer";
import { AccountController } from "./infra/controller/AccountController";
import GetAccount from "./application/usecase/GetAccount";
import Signup from "./application/usecase/Signup";

const httpServer = new ExpressServer()
Registry.getInstance().provide("httpServer", httpServer)
Registry.getInstance().provide("databaseConnection", new PgPromiseAdapter())
Registry.getInstance().provide("accountRepository", new AccountRepositoryDatabase())
Registry.getInstance().provide("mailerGateway", new MailerGatewayMemory())
Registry.getInstance().provide("signup", new Signup())
Registry.getInstance().provide("getAccount", new GetAccount())
Registry.getInstance().provide("accountController", new AccountController())
httpServer.listen(3000);
