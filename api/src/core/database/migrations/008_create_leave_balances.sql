CREATE TABLE leave_balances (
    id              SERIAL PRIMARY KEY,
    public_id       UUID         NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    user_id         INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    leave_type_id   INTEGER      NOT NULL REFERENCES leave_types(id) ON DELETE RESTRICT,
    year            INTEGER      NOT NULL CHECK (year >= 2000),

    allowance_days  INTEGER      NOT NULL CHECK (allowance_days >= 0),
    used_days       INTEGER      NOT NULL DEFAULT 0 CHECK (used_days >= 0),

    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_leave_balances_user_type_year
        UNIQUE (user_id, leave_type_id, year)
);

CREATE TRIGGER leave_balances_set_updated_at
    BEFORE UPDATE ON leave_balances
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_leave_balances_user_id ON leave_balances (user_id);
CREATE INDEX idx_leave_balances_leave_type_id ON leave_balances (leave_type_id);