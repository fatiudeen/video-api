import middlewares from "./middlewares";
import { VideoModel } from "./model";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import dtos from "./dtos";

class App {
  app: Application;
  constructor() {
    this.app = express();
    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandlers();
  }

  initMiddlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initRoutes() {
    this.app.get("/", (req, res) => {
      res.status(200).json({
        schema: {
          title: "string",
          owner: "string",
          thumbnail: "image",
          desc: "string",
          link: "string",
        },
        docs: {
          getAll: "GET /api/v1/videos",
          getAllForAUser: "GET /api/v1/videos?owner='owner_name'",
          create: "POST /api/v1/videos multipart/form-data",
          getOne: "GET /api/v1/videos/:id",
          update: "PUT /api/v1/videos/:id multipart/form-data",
          delete: "DELETE /api/v1/videos/:id",
        },
      });
    });

    this.app
      .route("/api/v1/videos")
      .get(async (req: Request, res: Response, next: NextFunction) => {
        try {
          const query = req.query.owner ? { owner: req.query.owner } : {};
          const data = await VideoModel.find(query);
          res.status(200).json({
            success: true,
            data,
          });
        } catch (error) {
          next(error);
        }
      })
      .post(
        middlewares.thumbnail,
        middlewares.validator(dtos.create),
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const data = await VideoModel.create({
              ...req.body,
              thumbnail: (<any>req).file.location,
            });
            res.status(201).json({
              success: true,
              data,
            });
          } catch (error) {
            next(error);
          }
        }
      );

    this.app
      .route("/api/v1/videos/:id")
      .get(
        middlewares.validator(dtos.id),
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const data = await VideoModel.findById(req.params.id);
            if (!data) throw new Error("item not found");
            res.status(201).json({
              success: true,
              data,
            });
          } catch (error) {
            next(error);
          }
        }
      )
      .delete(
        middlewares.validator(dtos.id),
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const data = await VideoModel.findByIdAndDelete(req.params.id);
            if (!data) throw new Error("item not found");
            res.status(201).json({
              success: true,
              data,
            });
          } catch (error) {
            next(error);
          }
        }
      )
      .put(
        middlewares.thumbnail,
        middlewares.validator(dtos.update),
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            const { body } = req;
            if ((<any>req).file) {
              body.thumbnail = (<any>req).file.location;
            }
            const data = await VideoModel.findByIdAndUpdate(
              req.params.id,
              body,
              {
                new: true,
              }
            );
            if (!data) throw new Error("item not found");
            res.status(201).json({
              success: true,
              data,
            });
          } catch (error) {
            next(error);
          }
        }
      );
  }

  initErrorHandlers() {
    this.app.use("*", middlewares.error404);
    this.app.use(middlewares.errorHandler);
  }

  instance() {
    return this.app;
  }
}

export default new App().instance();
