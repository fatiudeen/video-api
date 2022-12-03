import { model, Schema } from "mongoose";

export interface VideoInterface {
  title: string;
  owner: string;
  thumbnail: string;
  desc: string;
  link: string;
}

const schema = new Schema<VideoInterface>({
  title: String,
  owner: String,
  thumbnail: String,
  desc: String,
  link: String,
});

export const VideoModel = model("video", schema);
