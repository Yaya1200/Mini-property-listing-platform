-- Demo data for local/manual Supabase setup.
-- Run after schema.sql if you want visible listings in the public properties page.

INSERT INTO users (id, email, name, password_hash, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'owner@example.com',
  'Demo Property Owner',
  '$2b$10$NbTwB1nmeBnAJX7E5vGac.zEwXn9saLG2qycpx2RyatiZoWbpcrki',
  'property_owner'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = NOW();

INSERT INTO properties (id, owner_id, title, description, location, price, status, images)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Sunny Downtown Apartment',
    'A bright two-bedroom apartment with city views, updated finishes, and quick access to shops and transit.',
    'New York, NY',
    425000.00,
    'published',
    '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Modern Family Home',
    'A comfortable three-bedroom home with an open kitchen, private yard, and quiet residential setting.',
    'Austin, TX',
    585000.00,
    'published',
    '["https://images.unsplash.com/photo-1568605114967-8130f3a36994"]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Coastal Studio Retreat',
    'A compact studio near the beach with natural light, efficient storage, and a walkable neighborhood.',
    'San Diego, CA',
    315000.00,
    'published',
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"]'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  location = EXCLUDED.location,
  price = EXCLUDED.price,
  status = EXCLUDED.status,
  images = EXCLUDED.images,
  updated_at = NOW(),
  deleted_at = NULL;
