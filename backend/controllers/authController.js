const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

export async function loginAdmin(req, res) {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (username !== adminCredentials.username || password !== adminCredentials.password) {
    res.status(401).json({ message: 'Username atau password admin salah.' });
    return;
  }

  res.json({
    message: 'Login admin berhasil.',
    data: {
      token: `admin-${Date.now()}`,
      user: {
        username: adminCredentials.username,
        role: 'admin',
      },
    },
  });
}
