import { connect } from "mongoose";

export default (DB_URI: string) => {
  connect(DB_URI);
};
