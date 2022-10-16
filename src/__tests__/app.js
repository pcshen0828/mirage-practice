import { visit } from "../lib/test-helpers";
import { screen, waitForElementToBeRemoved } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import makeServer from "../server";

let server;

beforeEach(() => {
  // set the environment for TEST to isolate from DEV
  // so the tests run fast and the database starts out empty
  // the key point is: sharing the Mirage server across both development and testing environments
  server = makeServer("test");
});

afterEach(() => {
  // clean up after each test
  // to prevent multiple pretender instances from colliding with each other
  server.shutdown();
});

test("it shows a message when there are no reminders", async () => {
  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByText("All done!")).toBeInTheDocument();
});

test("it shows existing reminders", async () => {
  server.create("reminder", { text: "Walk the dog" });
  server.create("reminder", { text: "Take out the trash" });
  server.create("reminder", { text: "Work out" });

  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  expect(screen.getByText("Take out the trash")).toBeInTheDocument();
  expect(screen.getByText("Work out")).toBeInTheDocument();
});

test("it can add a reminder to a list", async () => {
  const list = server.create("list");

  visit(`/${list.id}?open`);
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  // screen.debug();
  // using 'data-testid' attributes to identify
  userEvent.click(screen.getByTestId("add-reminder"));
  await userEvent.type(screen.getByTestId("new-reminder-text"), "Work out");
  userEvent.click(screen.getByTestId("save-new-reminder"));

  await waitForElementToBeRemoved(() =>
    screen.getByTestId("new-reminder-text")
  );

  expect(screen.getByText("Work out")).toBeInTheDocument();
  // assert against the state of your Mirage server,
  expect(server.db.reminders.length).toEqual(1);
  expect(server.db.reminders[0].listId).toEqual(list.id);
});
