import axios, { AxiosError } from "axios";

describe("GET /", () => {
  it("check cookies", async () => {
    try {
      const res = await axios.get(`/reminders/`, {
        withCredentials: true,

        headers: {
          Cookie: "userId=6546",
        },
      });

      expect(res.status).toBe(200);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.status, error.code, error.response.status);
      } else {
        console.error(error);
      }
    }
  });
});
