CREATE TYPE user_role AS ENUM (
    'member',
    'manager'
);

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    public_id     UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    role          user_role    NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,

    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_users_public_id ON users (public_id);
CREATE INDEX idx_users_email     ON users (email);
CREATE INDEX idx_users_role      ON users (role);