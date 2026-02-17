-- Create table: users
CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    email text UNIQUE NOT NULL,
    name text,
    password text NOT NULL,
    role text DEFAULT 'reader' NOT NULL,
    avatar_url text,
    bio text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users (email);
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create table: posts
CREATE TABLE IF NOT EXISTS posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    author_id uuid NOT NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content text NOT NULL,
    excerpt text,
    featured_image text,
    category text,
    status text DEFAULT 'draft' NOT NULL,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE  INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE  INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE  INDEX IF NOT EXISTS idx_posts_author_id ON posts (author_id);
CREATE  INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at);
ALTER TABLE posts ADD CONSTRAINT fk_posts_author_id FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- Create table: tags
CREATE TABLE IF NOT EXISTS tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    name text UNIQUE NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_name ON tags (name);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_slug ON tags (slug);
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;

-- Create table: post_tags
CREATE TABLE IF NOT EXISTS post_tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    post_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags (post_id);
CREATE  INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags (tag_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_post_tags_unique ON post_tags (post_id, tag_id);
ALTER TABLE post_tags ADD CONSTRAINT fk_post_tags_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE post_tags ADD CONSTRAINT fk_post_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
ALTER TABLE post_tags DISABLE ROW LEVEL SECURITY;

-- Create table: comments
CREATE TABLE IF NOT EXISTS comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    status text DEFAULT 'pending' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE  INDEX IF NOT EXISTS idx_comments_post_id ON comments (post_id);
CREATE  INDEX IF NOT EXISTS idx_comments_user_id ON comments (user_id);
CREATE  INDEX IF NOT EXISTS idx_comments_status ON comments (status);
ALTER TABLE comments ADD CONSTRAINT fk_comments_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
ALTER TABLE comments ADD CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
