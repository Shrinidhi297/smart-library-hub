-- Seed data for books table
insert into public.books (title, author, isbn, description, category, total_copies, available_copies)
values 
  ('Atomic Habits', 'James Clear', '9780735211292', 'An easy and proven way to build good habits and break bad ones.', 'Self-Help', 10, 8),
  ('The Psychology of Money', 'Morgan Housel', '9780857197689', 'Doing well with money isn’t necessarily about what you know. It’s about how you behave.', 'Finance', 5, 5),
  ('Deep Work', 'Cal Newport', '9781455586691', 'Rules for focused success in a distracted world.', 'Productivity', 4, 2),
  ('Zero to One', 'Peter Thiel', '9780804139298', 'Notes on startups, or how to build the future.', 'Business', 7, 7),
  ('The Alchemist', 'Paulo Coelho', '9780062315007', 'A fable about following your dream.', 'Fiction', 12, 10),
  ('Sapiens', 'Yuval Noah Harari', '9780062316097', 'A brief history of humankind.', 'History', 8, 6),
  ('The Pragmatic Programmer', 'Andrew Hunt', '9780135957059', 'Your journey to mastery.', 'Technology', 3, 3),
  ('Clean Code', 'Robert C. Martin', '9780132350884', 'A handbook of agile software craftsmanship.', 'Technology', 5, 4);
