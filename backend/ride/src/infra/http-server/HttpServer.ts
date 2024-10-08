import express from "express";
import cors from "cors";

export interface HttpServer {
  register(method: string, url: string, callback: Function): Promise<any>
  listen(port: number): void
}

export class ExpressServer implements HttpServer {
  app: any

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  async register(method: string, url: string, callback: Function): Promise<any> {
    this.app[method](url, async function(request: any, response: any){
      try {
        const output = await callback(request.params, request.body)
        response.json(output)
      } catch(e: any) {
        response.status(422).json({ message: e.message });
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port)
  }
}

