// Welcome to the tutorial!
import {
  belongsTo,
  createServer,
  Factory,
  hasMany,
  Model,
  RestSerializer,
  trait,
} from "miragejs";

export default function makeServer(environment = "development") {
  return createServer({
    environment,
    // transform JSON payloads
    serializers: {
      reminder: RestSerializer.extend({
        include: ["list"], // every time it encounters a Reminder model in the response of a route handler, it should include its associated List (if it has one).
        embed: true, // tells Mirage how to serialize the included resources
      }),
    },

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

    factories: {
      list: Factory.extend({
        name(i) {
          return `List ${i}`;
        },
        // Use Traits to group related attribute and afterCreate logic, and to keep your factories composable
        withReminders: trait({
          // perform additional logic, like automatically creating related data for a model
          afterCreate(list, server) {
            server.createList("reminder", 5, { list });
          },
        }),
      }),

      reminder: Factory.extend({
        // text: 'Reminder text'
        text(i) {
          return `Reminder ${i}`;
        },
      }),
    },

    // seed Mirage with some initial data
    seeds(server) {
      // create new reminders in Mirage's data layer
      // IDs are automatically assigned
      // server.create("reminder", { text: "Walk the dog" });
      // server.create("reminder", { text: "Take out the trash" });
      // server.create("reminder", { text: "Work out" });

      // const homeList = server.create("list", { name: "Home" });
      // const workList = server.create("list", { name: "Work" });
      // server.create("reminder", { list: homeList, text: "Buy groceries" });
      // server.create("reminder", { list: workList, text: "Research mirage" });

      // server.create("reminder");
      // server.create("list", {
      //   reminders: server.createList("reminder", 5),
      // });
      server.create("list", {
        name: "Home",
        reminders: [server.create("reminder", { text: "Do yoga" })],
      });
      server.create("list", "withReminders");
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

      this.post("/api/lists", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        console.log(attrs);
        return schema.lists.create(attrs);
      });

      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        console.log(attrs); // When we defined our relationship, Mirage set up special attributes on our models known as foreign keys
        return schema.reminders.create(attrs);
      });

      this.delete("/api/lists/:id", (schema, request) => {
        let { id } = request.params;
        const list = schema.lists.find(id);
        // clear the reminders of the removed list
        list.reminders.destroy();

        return list.destroy();
      });

      this.delete("api/reminders/:id", (schema, request) => {
        // :segmentName to define a dynamic segment in the URL for a route handler
        let { id } = request.params; // Access dynamic segments

        return schema.reminders.find(id).destroy();
      });
    },
  });
}
