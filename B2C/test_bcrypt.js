import bcrypt from 'bcryptjs';

try {
  bcrypt.compareSync('test', undefined);
} catch (e) {
  console.log('Error message:', e.message);
  console.log('Error name:', e.name);
}
