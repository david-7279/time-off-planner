CREATE TABLE auth_sessions (
    id                  SERIAL PRIMARY KEY,
    public_id           UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    user_id             INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash  TEXT         NOT NULL UNIQUE,
    ip_address          INET,
    user_agent          VARCHAR(512),

    expires_at          TIMESTAMPTZ  NOT NULL,
    revoked_at          TIMESTAMPTZ,
    is_revoked          BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER auth_sessions_set_updated_at
    BEFORE UPDATE ON auth_sessions
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_auth_sessions_user_id            ON auth_sessions (user_id);
CREATE INDEX idx_auth_sessions_refresh_token_hash ON auth_sessions (refresh_token_hash);
CREATE INDEX idx_auth_sessions_is_revoked         ON auth_sessions (is_revoked);