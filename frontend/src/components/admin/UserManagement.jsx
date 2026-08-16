export default function UserManagement({ users = [] }) {
  return (
    <section className="card">
      <h2 className="section-title">User management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="list">
          {users.map((user) => (
            <li key={user.id || user.email} className="list-item">
              <span>{user.email || 'Unknown user'}</span>
              <span>{user.role || 'user'}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
