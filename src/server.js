// Welcome to the tutorial!
import { createServer, Model } from "miragejs";

export default function makeServer() {
  createServer({
    models: {
      reminder: Model,
    },

    // seed Mirage with some initial data
    seeds(server) {
      // create new reminders in Mirage's data layer
      // IDs are automatically assigned
      server.create("reminder", { text: "Walk the dog" });
      server.create("reminder", { text: "Take out the trash" });
      server.create("reminder", { text: "Work out" });
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
