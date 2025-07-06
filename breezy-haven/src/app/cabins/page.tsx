export default async function Page() {
  const data = await fetch('https://jsonplaceholder.typicode.com/users');

  const users = (await data.json()) as readonly User[];

  console.log(users);

  return (
    <>
      <h1>Cabin Page</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

interface Geo {
  readonly lat: string;
  readonly lng: string;
}

interface Address {
  readonly street: string;
  readonly suite: string;
  readonly city: string;
  readonly zipcode: string;
  readonly geo: Geo;
}

interface Company {
  readonly name: string;
  readonly catchPhrase: string;
  readonly bs: string;
}

interface User {
  readonly id: number;
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly address: Address;
  readonly phone: string;
  readonly website: string;
  readonly company: Company;
}
