-- ============================================================
-- AVALI — Schema do banco de dados
-- Execute no Supabase: SQL Editor → New query → Run
-- ============================================================

-- Tabela de escolas
CREATE TABLE IF NOT EXISTS schools (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  inep_code       text UNIQUE,
  name            text NOT NULL,
  slug            text UNIQUE,
  type            text NOT NULL DEFAULT 'particular',
  stages          text[] DEFAULT '{}',
  address         text DEFAULT '',
  city            text NOT NULL,
  state           text NOT NULL DEFAULT 'SP',
  neighborhood    text DEFAULT '',
  zip_code        text DEFAULT '',
  lat             float8,
  lng             float8,
  rating          float8 DEFAULT 0,
  review_count    int DEFAULT 0,
  avg_price       int DEFAULT 0,
  price_min       int DEFAULT 0,
  price_max       int DEFAULT 0,
  is_verified     bool DEFAULT false,
  is_autism_friendly bool DEFAULT false,
  is_claimed      bool DEFAULT false,
  description     text DEFAULT '',
  phone           text DEFAULT '',
  website         text DEFAULT '',
  photos          text[] DEFAULT '{}',
  highlights      text[] DEFAULT '{}',
  categories      jsonb DEFAULT '[]',
  created_at      timestamptz DEFAULT now()
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS reviews (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id       uuid REFERENCES schools(id) ON DELETE CASCADE,
  user_id         uuid REFERENCES auth.users(id),
  author_name     text NOT NULL,
  is_anonymous    bool DEFAULT false,
  rating          int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  categories      jsonb DEFAULT '[]',
  comment         text NOT NULL,
  pros            text DEFAULT '',
  cons            text DEFAULT '',
  would_recommend bool DEFAULT true,
  monthly_fee     int DEFAULT 0,
  stage           text DEFAULT '',
  year            int DEFAULT 2024,
  helpful         int DEFAULT 0,
  created_at      timestamptz DEFAULT now()
);

-- Perfis de usuários (extensão do auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role        text CHECK (role IN ('pai', 'profissional', 'escola')),
  name        text,
  email       text,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS schools_city_idx ON schools(city);
CREATE INDEX IF NOT EXISTS schools_state_idx ON schools(state);
CREATE INDEX IF NOT EXISTS schools_type_idx ON schools(type);
CREATE INDEX IF NOT EXISTS schools_rating_idx ON schools(rating DESC);
CREATE INDEX IF NOT EXISTS reviews_school_id_idx ON reviews(school_id);

-- Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas: escolas são públicas para leitura
CREATE POLICY "schools_public_read" ON schools
  FOR SELECT USING (true);

-- Políticas: avaliações são públicas para leitura
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

-- Políticas: usuário autenticado pode inserir avaliação
CREATE POLICY "reviews_auth_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas: usuário gerencia próprio perfil
CREATE POLICY "profiles_own_all" ON profiles
  FOR ALL USING (auth.uid() = id);

-- Função: criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: disparar ao criar usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
