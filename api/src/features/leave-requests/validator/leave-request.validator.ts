import { body } from "express-validator";
import { LEAVE_REQUEST_STATUSES } from "../types/leave-request.types.js";

export const createLeaveRequestValidator = [
  body("leaveTypeId")
    .custom((v) => typeof v === "number" && Number.isInteger(v) && v >= 1)
    .withMessage("Leave Type Id must be a positive integer"),

  body("startsAt")
    .isString()
    .withMessage("Starts At must be a string")
    .bail()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Starts At must be in YYYY-MM-DD format")
    .bail()
    .custom((v) => !Number.isNaN(Date.parse(v)))
    .withMessage("Starts At must be a real date"),

  body("endsAt")
    .isString()
    .withMessage("Ends At must be a string")
    .bail()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Ends At must be in YYYY-MM-DD format")
    .bail()
    .custom((v) => !Number.isNaN(Date.parse(v)))
    .withMessage("Ends At must be a real date")
    .bail()
    .custom((value, { req }) => {
      if (!req.body?.startsAt || value < req.body.startsAt) {
        throw new Error("Ends At must be on or after Starts At");
      }
      return true;
    }),
];

export const reviewLeaveRequestValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .bail()
    .isIn(LEAVE_REQUEST_STATUSES)
    .withMessage("Status must be 'approved' or 'rejected'"),

  body("note").isLength({ max: 400 }).withMessage("Note must be at most 400 characters"),
];
