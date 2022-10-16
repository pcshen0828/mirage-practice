// Welcome to the tutorial!
import { belongsTo, createServer, hasMany, Model } from "miragejs";

export default function makeServer() {
  createServer({
    models: {
      list: Model.extend({
        // association helpers
        reminders: hasMany(),
      }),
      reminder: Model.extend({
        // association helpers
        list: belongsTo(),
      }),
    },

    // seed Mirage with some initial data
    seeds(server) {
      // create new reminders in Mirage's data layer
      // IDs are automatically assigned
      server.create("reminder", { text: "Walk the dog" });
      server.create("reminder", { text: "Take out the trash" });
      server.create("reminder", { text: "Work out" });

      const homeList = server.create("list", { name: "Home" });
      const workList = server.create("list", { name: "Work" });
      server.create("reminder", { list: homeList, text: "Buy groceries" });
      server.create("reminder", { list: workList, text: "Research mirage" });
    },

    routes() {
      this.get("/api/lists", (schema) => {
        return schema.lists.all();
      });

      this.get("/api/reminders", (schema) => {
        return schema.reminders.all();
      });

      // associated
      this.get("/api/lists/:id/reminders", (schema, request) => {
        const listId = request.params.id;
        const list = schema.lists.find(listId);

        return list.reminders;
      });

      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        console.log(attrs); // When we defined our relationship, Mirage set up special attributes on our models known as foreign keys
        return schema.reminders.create(attrs);
      });

      this.delete("api/reminders/:id", (schema, request) => {
        // :segmentName to define a dynamic segment in the URL for a route handler
        let { id } = request.params; // Access dynamic segments

        return schema.reminders.find(id).destroy();
      });
    },
  });
}
