interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function signIn(): Promise<Response> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: 'hbsefkenlfweinjfhwfjwergnkefweflwemrglne534veg54tgbt54',
        user: {
          name: 'Victor',
          email: 'victortrin@gmail.com',
        },
      });
    }, 2000);
  });
}
