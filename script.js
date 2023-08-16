import http from "k6/http";
import { check, group } from "k6";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export const options = {
  // Load testing
  stages: [
    { duration: "10s", target: 100 }, // Expected 100 users
  ],
};

export default function () {
  group("K6 Get Test", () => {
    var url1 = "https://test.k6.io";

    let response1 = http.get(url1);

    check(response1, {
      "is status 200": (r) => r.status == 200,
    });
  });

  group("K6 Post Test", () => {
    var url2 = "https://reqres.in/api/users";

    let body = JSON.stringify({
      name: "morpheus",
      job: "leader",
    });

    let response2 = http.post(url2, body);

    check(response2, {
      "is status 201": (r) => r.status == 201,
    });

    group("K6 Get User (Sub)", () => {
      var url3 = "https://reqres.in/api/users/2";
      let response3 = http.get(url3);
      check(response3, {
        "is status 200": (r) => r.status == 200,
      });
    });
  });
}

export function handleSummary(data) {
  return {
    "script-result.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
