// Welcome to the test file for the tutorial!
import { visit } from "../lib/test-helpers";
import { screen, waitForElementToBeRemoved } from "@testing-library/dom";
import makeServer from "../server";

test("it shows a message when there are no reminders", async () => {
  // set the environment for TEST to isolate from DEV
  // the key point is: sharing the Mirage server across both development and testing environments
  let server = makeServer("test");

  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByText("All done!")).toBeInTheDocument();
  // prevent multiple pretender instances from colliding with each other
  server.shutdown();
});

test("it shows existing reminders", async () => {
  let server = makeServer("test");

  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByText("All done!")).toBeInTheDocument();
  server.shutdown();
});
