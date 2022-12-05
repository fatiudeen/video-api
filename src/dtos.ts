import { param, body } from "express-validator";

export default {
  id: [param("id").exists().isMongoId().withMessage("has to be a valid id")],
  create: [
    body("title").exists(),
    body("owner").exists(),
    body("desc").exists(),
    body("video").exists(),
  ],
  update: [
    body("title").optional(),
    body("owner").optional(),
    body("desc").optional(),
    body("video").optional(),
  ],
};
