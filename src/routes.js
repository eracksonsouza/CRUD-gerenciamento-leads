export const routes = [
  {
    method: "POST",
    path: "/leads",
    handler: (req, res) => {
      const { name, email } = req.body;

      const users = {
        id: 1,
        name,
        email,
      };

      return res
        .writeHead(201)
        .end(JSON.stringify("Lead created successfully"));
    },
  },
];
