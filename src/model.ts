import { model, Schema } from "mongoose";

export interface VideoInterface {
  title: string;
  owner: string;
  thumbnail: string;
  desc: string;
  video: string;
}

const schema = new Schema<VideoInterface>({
  title: String,
  owner: String,
  thumbnail: String,
  desc: String,
  video: String,
});

export const VideoModel = model("video", schema);
