// Welcome to the tutorial!
import { createServer, Model } from "miragejs";

export default function makeServer() {
  createServer({
    models: {
      reminder: Model,
    },

    routes() {
      this.get("/api/reminders", (schema) => {
        return schema.reminders.all();
      });

      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        return schema.reminders.create(attrs);
      });
    },
  });
}
